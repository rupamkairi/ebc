// src/i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
};

// Remove automatic top-level detection to avoid hydration mismatches.
// Language detection will be handled manually in I18nProvider after mount.
i18n.use(initReactI18next).init(i18nConfig);

export default i18n;
