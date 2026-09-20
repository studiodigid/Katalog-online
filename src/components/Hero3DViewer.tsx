import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Minimize2, Rotate3d, RotateCcw, Shirt, ZoomIn, ZoomOut } from 'lucide-react';
import { SceneManager } from '../engine3d/SceneManager';
import { DEMO_URL, DRACO_DECODER_PATH, HERO_GLB_URL } from '../config';
import { useLang } from '../i18n';
import { pinSlot, type Slot } from './viewerBus';
import { VIEWER_SHELL } from './viewerFrame';

type Status = 'loading' | 'ready' | 'error';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const controlButton =
  'grid h-9 w-9 place-items-center rounded-full text-navy transition-colors hover:bg-slate-100 active:bg-slate-200';

export default function Hero3DViewer({ slot }: { slot: Slot }) {
  const { t } = useLang();
  const hostRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [progress, setProgress] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(() => !prefersReducedMotion());
  const [fullscreen, setFullscreen] = useState(false);

  // Satu SceneManager = satu WebGL context. Dibuat saat mount, dibersihkan saat unmount.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let manager: SceneManager;

    try {
      manager = new SceneManager(host, {
        autoRotate: !prefersReducedMotion(),
        onUserInteract: () => setSpinning(false),
      });
    } catch (err) {
      // WebGL tidak tersedia
      if (import.meta.env.DEV) console.error('[Hero3DViewer] Gagal membuat scene 3D:', err);
      setStatus('error');
      return;
    }
    managerRef.current = manager;

    manager
      .loadModel({
        url: HERO_GLB_URL,
        dracoDecoderPath: DRACO_DECODER_PATH,
        onProgress: (ratio) => {
          if (!cancelled) setProgress(ratio);
        },
      })
      .then(() => {
        if (!cancelled) setStatus('ready');
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.error('[Hero3DViewer] Gagal memuat GLB:', HERO_GLB_URL, err);
        if (cancelled) return;
        manager.dispose(); // lepas context WebGL, lalu tampilkan fallback
        managerRef.current = null;
        setStatus('error');
      });

    // Jeda render saat viewer di luar layar
    const io = new IntersectionObserver(([entry]) => manager.setActive(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  // Layar penuh (CSS fixed, berfungsi juga di iOS Safari yang tidak mendukung Fullscreen API untuk div)
  useEffect(() => {
    if (!fullscreen) return;
    pinSlot(slot);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      pinSlot(null);
    };
  }, [fullscreen, slot]);

  const toggleSpin = () => {
    const next = managerRef.current?.toggleAutoRotate();
    if (typeof next === 'boolean') setSpinning(next);
  };

  const shell = fullscreen
    ? 'fixed inset-0 z-[70] bg-studio select-none'
    : `${VIEWER_SHELL} absolute inset-0 select-none`;

  return (
    <div className={shell}>
      {/* Kanvas WebGL */}
      <div
        ref={hostRef}
        role="img"
        aria-label={t.viewer.canvasLabel}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {status === 'loading' && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-studio"
        >
          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span>
              {t.viewer.loading}
              {progress !== null ? ` ${Math.round(progress * 100)}%` : ''}
            </span>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          role="status"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-studio px-6 text-center"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-accent shadow-sm">
            <Shirt className="h-6 w-6" />
          </span>
          <p className="text-base font-bold text-navy">{t.viewer.errorTitle}</p>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600">
            {t.viewer.errorBody} {t.viewer.errorHint}
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent-deep"
          >
            {t.viewer.openDemo}
            <ArrowUpRight className="h-4 w-4" />
          </a>
          {fullscreen && (
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="text-sm font-semibold text-slate-600 underline"
            >
              {t.viewer.exitFullscreen}
            </button>
          )}
        </div>
      )}

      {status !== 'error' && (
        <>
          {/* Atas: label produk (terpotong dengan ellipsis bila sempit) + tombol layar penuh */}
          <div className="absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-navy shadow-sm">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span className="truncate">{t.viewer.label}</span>
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex">
                {t.viewer.badge}
              </span>
              <button
                type="button"
                onClick={() => setFullscreen((v) => !v)}
                aria-label={fullscreen ? t.viewer.exitFullscreen : t.viewer.fullscreen}
                title={fullscreen ? t.viewer.exitFullscreen : t.viewer.fullscreen}
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white text-navy shadow-sm transition-colors hover:bg-slate-100"
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Bawah: kontrol (kiri) dan CTA demo (kanan) */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-2">
            <div className="pointer-events-auto flex items-center rounded-full bg-white p-0.5 shadow-sm">
              <button
                type="button"
                className={controlButton}
                onClick={() => managerRef.current?.zoomIn()}
                aria-label={t.viewer.zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={controlButton}
                onClick={() => managerRef.current?.zoomOut()}
                aria-label={t.viewer.zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={controlButton}
                onClick={() => managerRef.current?.resetView()}
                aria-label={t.viewer.reset}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`${controlButton} ${spinning ? 'bg-accent-soft text-accent' : ''}`}
                onClick={toggleSpin}
                aria-pressed={spinning}
                aria-label={spinning ? t.viewer.stopSpin : t.viewer.spin}
              >
                <Rotate3d className="h-4 w-4" />
              </button>
            </div>

            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-navy px-4 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-charcoal"
            >
              {t.viewer.openDemo}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
