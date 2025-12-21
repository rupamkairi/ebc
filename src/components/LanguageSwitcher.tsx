"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useSyncExternalStore } from "react";

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Don't render anything until we're on the client
  if (!isMounted) {
    return null;
  }

  const languages = [
    { code: "en-IN", name: t("english") },
    { code: "hn-IN", name: t("hinglish") },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{t("language")}:</span>
      <select
        value={currentLanguage}
        onChange={(e) => {
          console.log(e.target.value);
          changeLanguage(e.target.value);
          window.location.reload();
        }}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
