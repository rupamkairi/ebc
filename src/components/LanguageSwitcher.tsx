"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useSyncExternalStore } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

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

      <NativeSelect
        value={currentLanguage}
        onChange={(e) => {
          changeLanguage(e.target.value);
          window.location.reload();
        }}
      >
        {languages.map((lang) => (
          <NativeSelectOption key={lang.code} value={lang.code}>
            {lang.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};
