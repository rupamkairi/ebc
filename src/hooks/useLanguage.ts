// src/hooks/useLanguage.ts
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import i18n from "@/i18n/config";

export const useLanguage = () => {
  // Initialize with the current language from i18n
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  // Track mount state to handle hydration properly
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Update the language in both i18n and localStorage
  const changeLanguage = useCallback((lng: string) => {
    localStorage.setItem("i18nextLng", lng);
    return i18n.changeLanguage(lng);
  }, []);

  useEffect(() => {
    // Handle language changes from i18n
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    // Set up the event listener
    i18n.on("languageChanged", handleLanguageChange);
    
    // Sync state with actual i18n language (for initial render)
    if (i18n.language !== currentLanguage) {
      setCurrentLanguage(i18n.language);
    }

    // Clean up the event listener
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    t: i18n.t.bind(i18n),
    isReady: isMounted,
  };
};
