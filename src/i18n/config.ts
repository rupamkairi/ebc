// src/i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English translations
const english = {
  welcome: "Welcome",
  greeting: "Hello, {{name}}!",
  language: "Language",
  english: "English",
  hinglish: "Hinglish",
  // Add more translations as needed
};

// Hinglish translations (Hindi words in English script)
const hinglish = {
  welcome: "Swagat hai",
  greeting: "Namaste, {{name}}!",
  language: "Bhasha",
  english: "Angrezi",
  hinglish: "Hinglish",
  // Add more translations as needed
};

// Create a separate config object for better type inference
const i18nConfig = {
  resources: {
    "en-IN": { translation: english },
    "hn-IN": { translation: hinglish },
  },
  fallbackLng: "en-IN",
  interpolation: {
    escapeValue: false,
  },
  // Only enable detection on client side
  ...(typeof window !== "undefined" && {
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  }),
};

// Initialize i18n
i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);

export default i18n;
