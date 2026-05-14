"use client";

import { createContext, useContext, useState, useCallback } from "react";
import zh from "./zh";
import en from "./en";
import type { TranslationKey } from "./zh";

export type Lang = "zh" | "en";
const translations = { zh, en };

interface LanguageContextValue {
  lang: Lang;
  t: (key: TranslationKey) => string;
  setLang: (lang: Lang) => void;
}

import React from "react";

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "zh",
  t: (key) => zh[key],
  setLang: () => {},
});

export function LanguageProvider({
  children,
  initialLang = "zh",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.cookie = `ai_nav_lang=${l};path=/;max-age=31536000;SameSite=Lax`;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] ?? translations.zh[key] ?? key,
    [lang]
  );

  const CtxProvider = LanguageContext.Provider;
  return (
    <CtxProvider value={{ lang, t, setLang }}>
      {children}
    </CtxProvider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
