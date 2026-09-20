import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'onDark';

interface CTAProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold transition-colors';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-deep',
  secondary: 'border border-slate-300 bg-white text-navy hover:border-navy',
  onDark: 'border border-white/30 text-white hover:bg-white/10',
};

export default function CTA({ href, children, variant = 'primary', className = '' }: CTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
