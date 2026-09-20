import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Catalog SceneManager.
 *
 * Engine 3D DIGID yang sudah teruji.
 * Nilai kamera, OrbitControls, renderer, tone mapping, lighting, shadow, pedestal,
 * centering bounding box, target tinggi 2.15, dan wrapper `baseball_jacket_root`
 * dibiarkan identik. Yang dibuang: TextureSynthesizer, GarmentMeshGenerator,
 * fallback procedural, dan updateConfiguration (tidak dipakai di katalog).
 *
 * Tambahan khusus landing page (tidak mengubah tampilan render):
 *  - ResizeObserver menggantikan window resize
 *  - jarak kamera menyesuaikan layar potret agar lengan jaket tidak terpotong
 *  - render dijeda saat hero tidak terlihat
 *  - dispose() membersihkan geometry/material/texture dan melepas WebGL context
 */

export interface SceneManagerOptions {
  /** Putar pelan sampai pengguna menyentuh model. */
  autoRotate?: boolean;
  /** Dipanggil sekali saat pengguna mulai berinteraksi. */
  onUserInteract?: () => void;
}

export interface LoadModelOptions {
  url: string;
  dracoDecoderPath: string;
  /** 0..1 bila ukuran file diketahui, null bila tidak. */
  onProgress?: (ratio: number | null) => void;
}

function disposeObject(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material as unknown as Record<string, unknown>)) {
        if (value && (value as THREE.Texture).isTexture) (value as THREE.Texture).dispose();
      }
      material.dispose();
    }
  });
}

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private currentGLBGroup: THREE.Group | null = null;
  private groundObjects: THREE.Mesh[] = [];
  private dracoLoader: DRACOLoader | null = null;
  private gltfLoader: GLTFLoader | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private animationFrameId: number | null = null;
  private transitionId = 0;
  private isDisposed = false;
  private isActive = true;
  private autoRotate = false;
  private userMoved = false;
  private modelWidth = 0; // lebar model setelah di-scale (unit scene)
  private readonly onUserInteract?: () => void;

  // Posisi kamera default (engine DIGID)
  private readonly defaultCameraPos = new THREE.Vector3(0, 0.2, 4.2);
  private readonly targetLookAt = new THREE.Vector3(0, 0, 0);
  private homePos = this.defaultCameraPos.clone();

  constructor(container: HTMLElement, options: SceneManagerOptions = {}) {
    this.container = container;
    this.onUserInteract = options.onUserInteract;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);

    // 2. Camera
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.copy(this.defaultCameraPos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    // updateStyle=false: ukuran canvas diatur CSS (100%), bukan piksel inline
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    // PCFSoftShadowMap sudah dihapus di three r18x (otomatis jatuh ke PCFShadowMap dengan warning)
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // 4. OrbitControls (nilai engine DIGID)
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 6.8;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.18;
    this.controls.minPolarAngle = 0.15;
    this.controls.target.copy(this.targetLookAt);
    // Landing page: model tetap di tengah, jadi pan dimatikan
    this.controls.enablePan = false;

    // Di layar sentuh, geser vertikal harus tetap menggulir halaman.
    // Geser horizontal memutar model, cubit dua jari untuk zoom.
    if (window.matchMedia('(pointer: coarse)').matches) {
      canvas.style.touchAction = 'pan-y';
    }

    if (options.autoRotate) {
      this.autoRotate = true;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.2;
    }
    this.controls.addEventListener('start', this.handleControlsStart);

    // 5. Lighting & 6. Ground
    this.setupLighting();
    this.setupGround();

    // 7. Resize
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(container);

    // 8. Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  private handleControlsStart = () => {
    this.userMoved = true;
    this.transitionId++; // batalkan transisi kamera yang sedang jalan
    if (this.autoRotate) {
      this.autoRotate = false;
      this.controls.autoRotate = false;
    }
    this.onUserInteract?.();
  };

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    keyLight.position.set(3.5, 4.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = 12.0;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    fillLight.position.set(-3.5, 2.5, 3.0);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(0, 3.5, -3.5);
    this.scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xf8fafc, 0.6);
    bounceLight.position.set(0, -3.0, 1.5);
    this.scene.add(bounceLight);
  }

  private setupGround() {
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.25;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);

    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(1.68, 1.72, 64),
      new THREE.MeshBasicMaterial({ color: 0xcbd5e1, side: THREE.DoubleSide }),
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.248;
    this.scene.add(ringMesh);

    this.groundObjects = [shadowPlane, ringMesh];
  }

  private getGLTFLoader(dracoDecoderPath: string): GLTFLoader {
    if (!this.gltfLoader) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(dracoDecoderPath);
      this.gltfLoader = new GLTFLoader();
      this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }
    return this.gltfLoader;
  }

  /** Muat GLB. Material dan tekstur bawaan GLB dipertahankan apa adanya. */
  public async loadModel({ url, dracoDecoderPath, onProgress }: LoadModelOptions): Promise<void> {
    const loader = this.getGLTFLoader(dracoDecoderPath);

    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        resolve,
        (event) => {
          onProgress?.(event.lengthComputable && event.total > 0 ? event.loaded / event.total : null);
        },
        reject,
      );
    });

    const gltfScene = gltf.scene as THREE.Group;

    // Komponen sudah di-unmount saat GLB masih diunduh
    if (this.isDisposed) {
      disposeObject(gltfScene);
      return;
    }

    // Shadow + double-sided (engine DIGID). Material/tekstur tidak diganti.
    gltfScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of materials) {
          if (!mat) continue;
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        }
      }
    });

    // Bounding box -> center -> scale ke tinggi 2.15
    gltfScene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(gltfScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const wrapper = new THREE.Group();
    wrapper.name = 'baseball_jacket_root';

    gltfScene.position.set(-center.x, -center.y, -center.z);
    wrapper.add(gltfScene);

    const targetHeight = 2.15;
    const maxDimension = Math.max(size.y, size.x, 0.001);
    const scale = targetHeight / (size.y || maxDimension);
    wrapper.scale.setScalar(scale);
    wrapper.position.y = 0.05;

    this.modelWidth = Math.max(size.x, size.z) * scale;

    this.currentGLBGroup = wrapper;
    this.scene.add(wrapper);

    this.updateHomePosition();
  }

  /**
   * Di layar potret, jarak kamera default (4.2) bisa memotong lengan jaket.
   * Jarak dinaikkan secukupnya agar seluruh lebar model terlihat. Di layar
   * lebar hasilnya tetap sama dengan engine DIGID.
   */
  private updateHomePosition() {
    const aspect = this.camera.aspect || 1;
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const margin = 1.18;

    const dir = this.defaultCameraPos.clone().normalize();
    let distance = this.defaultCameraPos.length();

    if (this.modelWidth > 0) {
      const neededForWidth = (this.modelWidth * margin) / (2 * tanHalfFov * aspect);
      distance = Math.max(distance, neededForWidth);
    }
    distance = Math.min(distance, this.controls.maxDistance);

    this.homePos = dir.multiplyScalar(distance);

    // Selama pengguna belum menyentuh kamera, ikuti posisi home yang baru
    if (!this.userMoved && !this.isDisposed) {
      this.camera.position.copy(this.homePos);
      this.controls.update();
    }
  }

  private smoothTransitionCamera(targetPos: THREE.Vector3) {
    const id = ++this.transitionId;
    const startPos = this.camera.position.clone();
    const duration = 400;
    const startTime = performance.now();

    const step = (now: number) => {
      if (this.isDisposed || id !== this.transitionId) return;
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.copy(this.targetLookAt);
      this.controls.update();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  public resetView(): void {
    this.smoothTransitionCamera(this.homePos);
  }

  public toggleAutoRotate(): boolean {
    this.autoRotate = !this.autoRotate;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 2.0;
    return this.autoRotate;
  }

  public zoomIn(): void {
    this.dolly(-0.5);
  }

  public zoomOut(): void {
    this.dolly(0.5);
  }

  private dolly(delta: number) {
    this.userMoved = true;
    this.transitionId++;
    const currentDist = this.camera.position.distanceTo(this.targetLookAt);
    const newDist = THREE.MathUtils.clamp(
      currentDist + delta,
      this.controls.minDistance,
      this.controls.maxDistance,
    );
    const dir = this.camera.position.clone().sub(this.targetLookAt).normalize();
    this.camera.position.copy(this.targetLookAt.clone().add(dir.multiplyScalar(newDist)));
    this.controls.update();
  }

  /** Jeda/lanjutkan render, dipakai saat hero keluar/masuk layar. */
  public setActive(active: boolean): void {
    if (this.isDisposed || this.isActive === active) return;
    this.isActive = active;
    if (active) {
      this.animate();
    } else if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private onResize = () => {
    if (this.isDisposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.updateHomePosition();
  };

  private animate() {
    if (this.isDisposed || !this.isActive) return;
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.transitionId++;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.currentGLBGroup) {
      this.scene.remove(this.currentGLBGroup);
      disposeObject(this.currentGLBGroup);
      this.currentGLBGroup = null;
    }
    for (const mesh of this.groundObjects) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    this.groundObjects = [];

    this.dracoLoader?.dispose();
    this.dracoLoader = null;
    this.gltfLoader = null;

    this.controls.removeEventListener('start', this.handleControlsStart);
    this.controls.dispose();
    this.renderer.dispose();
    // Lepas WebGL context sekarang juga, agar tidak menumpuk (StrictMode / navigasi)
    this.renderer.forceContextLoss();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
