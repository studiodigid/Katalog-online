import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { copy, type Copy, type Lang } from './data/copy';

const STORAGE_KEY = 'digid-lang';

interface LangContextValue {
  lang: Lang;
  t: Copy;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

function readInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en') return stored;
  } catch {
    /* storage bisa kosong atau diblokir */
  }
  return 'id'; // bahasa default: Indonesia
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* abaikan */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = copy[lang].meta.title;
  }, [lang]);

  const value = useMemo(() => ({ lang, t: copy[lang], setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang harus dipakai di dalam <LangProvider>');
  return ctx;
}
