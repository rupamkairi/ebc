"use client";

import i18n from "@/i18n/config";
import { useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const initialize = async () => {
      try {
        const savedLanguage = localStorage.getItem("i18nextLng");
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
        initializedRef.current = true;
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
      }
    };

    initialize();
  }, []);

  // Always wrap children with I18nextProvider to maintain a stable component tree/path.
  // This helps avoid hydration mismatches that occur when the tree structure changes.
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
