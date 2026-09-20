import { Check } from 'lucide-react';
import { useLang } from '../i18n';
import { DEMO_URL, whatsappUrl } from '../config';
import CTA from './CTA';
import ViewerSlot from './ViewerSlot';

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const sectionPad = 'py-14 sm:py-20 lg:py-24';
const h2 = 'text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl';

/* ---------- Masalah: "Apa masalah yang saya alami?" ---------- */
function Problem() {
  const { t } = useLang();
  return (
    <section id="masalah" className={`bg-white ${sectionPad}`}>
      <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className={`${h2} text-navy`}>{t.problem.title}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">{t.problem.intro}</p>
          </div>
        </div>
        <ul className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-7">
          {t.problem.items.map((item) => (
            <li key={item.title} className="flex gap-4 py-5">
              <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div>
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-1 max-w-xl leading-relaxed text-slate-600">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Demo: "Seperti apa hasilnya?" ---------- */
function Demo() {
  const { t, lang } = useLang();
  return (
    <section id="katalog-3d" className={`bg-paper ${sectionPad}`}>
      <div className={`${container} grid items-center gap-8 lg:grid-cols-12 lg:gap-14`}>
        <div className="lg:order-2 lg:col-span-5">
          <h2 className={`${h2} text-navy`}>{t.demo.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{t.demo.body}</p>
          <p className="mt-5 text-lg font-bold leading-snug text-navy">{t.demo.line}</p>
          <CTA href={whatsappUrl(lang)} variant="primary" className="mt-7 w-full sm:w-auto">
            {t.demo.cta}
          </CTA>
        </div>
        <div className="lg:order-1 lg:col-span-7">
          <ViewerSlot slot="demo" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Cara kerja: "Bagaimana prosesnya?" ---------- */
function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="cara-kerja" className={`bg-white ${sectionPad}`}>
      <div className={container}>
        <h2 className={`${h2} text-navy`}>{t.how.title}</h2>
        <ol className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {t.how.steps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-navy pt-4">
              <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-xl font-extrabold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Belum punya file 3D: "Saya harus siapkan apa?" ---------- */
function Assets() {
  const { t } = useLang();
  return (
    <section id="file-3d" className={`bg-paper ${sectionPad}`}>
      <div className={`${container} max-w-4xl`}>
        <h2 className={`${h2} text-navy`}>{t.assets.title}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{t.assets.body}</p>
      </div>
    </section>
  );
}

/* ---------- Contoh produk: "Cocok untuk produk saya?" ---------- */
function UseCases() {
  const { t } = useLang();
  return (
    <section id="contoh" className={`bg-white ${sectionPad}`}>
      <div className={container}>
        <h2 className={`${h2} max-w-2xl text-navy`}>{t.useCases.title}</h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {t.useCases.items.map((name) => (
            <li
              key={name}
              className="rounded-2xl border border-slate-200 bg-paper px-4 py-5 text-center text-base font-extrabold text-navy"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Manfaat: "Apa untungnya?" ---------- */
function Benefits() {
  const { t } = useLang();
  return (
    <section id="manfaat" className={`bg-paper ${sectionPad}`}>
      <div className={container}>
        <h2 className={`${h2} max-w-2xl text-navy`}>{t.benefits.title}</h2>
        <ul className="mt-9 grid gap-x-12 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {t.benefits.items.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <div>
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-base font-semibold text-navy">{t.benefits.grow}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{t.benefits.disclaimer}</p>
      </div>
    </section>
  );
}

/* ---------- CTA akhir: "Apa langkah berikutnya?" ---------- */
function FinalCTA() {
  const { t, lang } = useLang();
  return (
    <section id="kontak" className="bg-paper px-4 pb-14 sm:px-6 lg:px-8 lg:pb-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-navy px-6 py-12 text-white sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_70%_at_100%_0%,rgba(225,29,72,0.35),transparent_70%)]"
        />
        <div className="relative max-w-2xl">
          <h2 className={h2}>{t.finalCta.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{t.finalCta.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href={whatsappUrl(lang)} variant="primary">
              {t.finalCta.primary}
            </CTA>
            <CTA href={DEMO_URL} variant="onDark">
              {t.finalCta.secondary}
            </CTA>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const { t } = useLang();
  return (
    <footer id="site-footer" className="border-t border-slate-200 bg-white pb-24 pt-8 sm:pb-20">
      <div className={`${container} flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-navy">{t.brand.name}</p>
          <p className="text-sm text-slate-500">{t.footer.text}</p>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} DIGID Studio</p>
      </div>
    </footer>
  );
}

export default function BelowFold() {
  return (
    <>
      <Problem />
      <Demo />
      <HowItWorks />
      <Assets />
      <UseCases />
      <Benefits />
      <FinalCTA />
      <Footer />
    </>
  );
}
