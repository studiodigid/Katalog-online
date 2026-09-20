# DIGID Studio — Landing Page DIGID 3D Catalog

React + TypeScript + Vite + Tailwind v4 + Three.js.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + build ke dist/
```

- `src/engine3d/SceneManager.ts` — engine 3D DIGID.
- `src/components/Hero3DViewer.tsx` — viewer: loading, fallback error, kontrol, layar penuh.
- `src/components/viewerBus.ts` + `ViewerSlot.tsx` — hero dan demo berbagi SATU WebGL context.
- `src/config.ts` — URL GLB, Draco, demo, WhatsApp (pesan otomatis per bahasa).
- `src/data/copy.ts` — copy ID dan EN.
- `src/components/BelowFold.tsx` — section di bawah hero (dimuat belakangan).
