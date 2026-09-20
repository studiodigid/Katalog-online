import { lazy, Suspense, useEffect, useState } from 'react';
import { LangProvider, useLang } from './i18n';
import Header from './components/Header';
import Hero from './components/Hero';
import WhatsAppButton from './components/WhatsAppButton';

// Bagian di bawah hero dimuat belakangan agar hero + GLB mendapat prioritas jaringan
const BelowFold = lazy(() => import('./components/BelowFold'));

function DeferredBelowFold() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w: Partial<Window> = window;
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const handle = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(handle);
  }, []);

  const placeholder = <div className="min-h-[60vh]" aria-hidden />;
  if (!ready) return placeholder;
  return (
    <Suspense fallback={placeholder}>
      <BelowFold />
    </Suspense>
  );
}

function Page() {
  const { t } = useLang();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {t.nav.skip}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <DeferredBelowFold />
      </main>
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  );
}
