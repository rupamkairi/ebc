"use client";

import i18n from "@/i18n/config";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { I18nextProvider } from "react-i18next";

// Initialize language synchronously if localStorage is available
// This runs during module initialization, before React renders
function getInitialLanguage(): string | null {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("i18nextLng");
    } catch {
      return null;
    }
  }
  return null;
}

// Set language immediately on module load to avoid hydration mismatch
const savedLang = getInitialLanguage();
if (savedLang && savedLang !== i18n.language) {
  i18n.changeLanguage(savedLang);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initializedRef = useRef(false);
  
  // Track if we're mounted on client
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (initializedRef.current) return;

    const initialize = async () => {
      try {
        const savedLanguage = localStorage.getItem("i18nextLng");
        if (savedLanguage && savedLanguage !== i18n.language) {
          await i18n.changeLanguage(savedLanguage);
        }
        initializedRef.current = true;
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
      }
    };

    initialize();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
