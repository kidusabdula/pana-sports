"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "am";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (obj: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load persisted language preference
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "en" || savedLang === "am") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Helper function to get localized string from an object
  // e.g., t(league, 'name') -> league.name_en or league.name_am
  const t = (obj: any, field: string): string => {
    if (!obj) return "";
    const key = `${field}_${language}`;
    return obj[key] || obj[`${field}_en`] || ""; // Fallback to English if translation missing
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
