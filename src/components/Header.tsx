import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang } from '../i18n';
import { whatsappUrl } from '../config';

const links = [
  { key: 'catalog', href: '#katalog-3d' },
  { key: 'how', href: '#cara-kerja' },
  { key: 'examples', href: '#contoh' },
] as const;

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="flex items-center rounded-full border border-white/20 bg-white/10 p-0.5 text-xs font-bold"
    >
      {(['id', 'en'] as const).map((code, i) => (
        <span key={code} className="flex items-center">
          {i === 1 && <span aria-hidden className="mx-0.5 h-3 w-px bg-white/25" />}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`rounded-full px-2 py-1.5 transition-colors sm:px-2.5 ${
              lang === code ? 'bg-white text-navy' : 'text-slate-300 hover:text-white'
            }`}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [open]);

  const startUrl = whatsappUrl(lang);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        <a href="#hero" className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label={t.brand.name}>
          <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 sm:h-9 sm:w-9">
            <span className="h-3.5 w-3.5 rounded-md bg-accent sm:h-4 sm:w-4" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight">{t.brand.name}</span>
            <span className="block whitespace-nowrap text-[10px] font-medium text-slate-400 sm:text-[11px]">
              {t.brand.tagline}
            </span>
          </span>
        </a>

        <nav aria-label="Utama" className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            >
              {t.nav[l.key]}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <LangSwitch />
          <a
            href={startUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center rounded-full bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent-deep md:inline-flex"
          >
            {t.nav.start}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Utama"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-navy px-4 pb-4 pt-2 shadow-lg md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10"
                >
                  {t.nav[l.key]}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={startUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-white"
          >
            {t.nav.start}
          </a>
        </nav>
      )}
    </header>
  );
}
