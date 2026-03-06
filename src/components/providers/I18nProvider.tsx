"use client";

import i18n from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import { I18nextProvider } from "react-i18next";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
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
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
        setIsReady(true);
      }
    };

    initialize();
  }, []);

  if (typeof window === "undefined" || !isReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
