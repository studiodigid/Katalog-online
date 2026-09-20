import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from 'react';
import { useLang } from '../i18n';
import { getOwner, reportVisibility, subscribeOwner, type Slot } from './viewerBus';
import { VIEWER_SHELL, VIEWER_SIZE } from './viewerFrame';

// three.js dimuat sebagai chunk terpisah
const Hero3DViewer = lazy(() => import('./Hero3DViewer'));

function Frame() {
  return <div className={`${VIEWER_SHELL} absolute inset-0 animate-pulse`} aria-hidden="true" />;
}

export default function ViewerSlot({ slot }: { slot: Slot }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const owner = useSyncExternalStore(subscribeOwner, getOwner);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => reportVisibility(slot, entry.isIntersecting ? entry.intersectionRatio : 0),
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      reportVisibility(slot, 0);
    };
  }, [slot]);

  return (
    <div className="min-w-0">
      <div ref={ref} className={`relative w-full ${VIEWER_SIZE}`}>
        {owner === slot ? (
          <Suspense fallback={<Frame />}>
            <Hero3DViewer slot={slot} />
          </Suspense>
        ) : (
          <Frame />
        )}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">{t.viewer.hint}</p>
    </div>
  );
}
