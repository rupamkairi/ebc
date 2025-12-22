"use client";

import i18n from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import { I18nextProvider } from "react-i18next";

// Client-side language detection and initialization
export default function I18NProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  // Use a ref to track if we've already initialized
  const initializedRef = useRef(false);

  useEffect(() => {
    // Skip if already initialized
    if (initializedRef.current) return;

    const initialize = async () => {
      try {
        // Initialize with language from localStorage or browser
        const savedLanguage = localStorage.getItem("i18nextLng");
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
        initializedRef.current = true;
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
        setIsReady(true); // Still render children even if i18n fails
      }
    };

    initialize();

    // No cleanup needed
    return undefined;
  }, []);

  // On server-side or not ready, render children without i18n provider
  if (typeof window === "undefined" || !isReady) {
    return <>{children}</>;
  }

  // On client-side, provide i18n context
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
