import { useLang } from '../i18n';
import { DEMO_URL, whatsappUrl } from '../config';
import CTA from './CTA';
import ViewerSlot from './ViewerSlot';

export default function Hero() {
  const { t, lang } = useLang();

  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_78%_45%,rgba(225,29,72,0.09),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-16">
        <div>
          <h1 className="text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">{t.hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href={whatsappUrl(lang)} variant="primary">
              {t.hero.primary}
            </CTA>
            <CTA href={DEMO_URL} variant="secondary">
              {t.hero.secondary}
            </CTA>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-500">{t.hero.note}</p>
        </div>

        <ViewerSlot slot="hero" />
      </div>
    </section>
  );
}
