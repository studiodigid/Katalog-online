import { useEffect, useState } from 'react';
import { whatsappUrl } from '../config';
import { useLang } from '../i18n';

/**
 * Tombol WhatsApp mengambang (kanan bawah).
 * Disembunyikan selama hero, demo viewer, CTA akhir, dan footer terlihat,
 * supaya tidak pernah menutupi model, CTA, atau footer.
 */
const HIDE_WHILE_VISIBLE = ['hero', 'katalog-3d', 'kontak', 'site-footer'];

function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 7.42C8.88 7.42 8.63 7.48 8.41 7.72C8.2 7.95 7.58 8.53 7.58 9.7C7.58 10.87 8.43 12 8.55 12.16C8.67 12.32 10.22 14.71 12.63 15.75C14.64 16.62 15.05 16.44 15.49 16.4C15.93 16.36 16.91 15.82 17.11 15.26C17.31 14.7 17.31 14.22 17.25 14.12C17.19 14.02 17.03 13.96 16.79 13.84C16.55 13.72 15.36 13.13 15.14 13.05C14.92 12.97 14.76 12.93 14.6 13.17C14.44 13.41 13.98 13.96 13.84 14.12C13.7 14.28 13.56 14.3 13.32 14.18C13.08 14.06 12.3 13.8 11.37 12.97C10.64 12.32 10.15 11.52 10.01 11.28C9.87 11.04 10 10.91 10.12 10.79C10.23 10.68 10.37 10.5 10.49 10.36C10.61 10.22 10.65 10.12 10.73 9.96C10.81 9.8 10.77 9.66 10.71 9.54C10.65 9.42 10.19 8.29 10 7.82C9.81 7.37 9.62 7.43 9.47 7.42C9.33 7.41 9.17 7.42 9.04 7.42Z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const { lang } = useLang();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const vh = window.innerHeight;
      const overlaps = HIDE_WHILE_VISIBLE.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < vh && r.bottom > 0;
      });
      setHidden(overlaps);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    // Bagian bawah halaman dimuat menyusul, jadi cek ulang secara berkala singkat setelah mount
    const settle = window.setInterval(check, 500);
    const stop = window.setTimeout(() => window.clearInterval(settle), 6000);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearInterval(settle);
      window.clearTimeout(stop);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const label = lang === 'id' ? 'Chat DIGID Studio lewat WhatsApp' : 'Chat with DIGID Studio on WhatsApp';

  return (
    <a
      href={whatsappUrl(lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      tabIndex={hidden ? -1 : 0}
      className={`fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:bg-[#20bd5a] sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
        hidden ? 'pointer-events-none translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}
