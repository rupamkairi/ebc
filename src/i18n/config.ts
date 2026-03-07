// src/i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hn from "./locales/hn.json";

const i18nConfig = {
  resources: {
    "en-IN": { translation: en },
    "hn-IN": { translation: hn },
  },
  fallbackLng: "en-IN",
  interpolation: {
    escapeValue: false,
  },
  ...(typeof window !== "undefined" && {
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  }),
};

if (typeof window !== "undefined") {
  i18n.use(LanguageDetector);
}
i18n.use(initReactI18next).init(i18nConfig);

export default i18n;
