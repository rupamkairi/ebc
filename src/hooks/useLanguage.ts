// src/hooks/useLanguage.ts
import { useState, useEffect, useCallback } from "react";
import i18n from "@/i18n/config";

export const useLanguage = () => {
  // Initialize with the current language from i18n
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Update the language in both i18n and localStorage
  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      // This will trigger the languageChanged event that we're listening to below
      localStorage.setItem("i18nextLng", lng);
    });
  }, []);

  useEffect(() => {
    // Handle language changes from i18n
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    // Set up the event listener
    i18n.on("languageChanged", handleLanguageChange);

    // Load saved language on initial render
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && savedLanguage !== i18n.language) {
      changeLanguage(savedLanguage);
    }

    // Clean up the event listener
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [changeLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    t: i18n.t.bind(i18n),
  };
};
