"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useSyncExternalStore } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "footer";
}

export const LanguageSwitcher = ({
  className,
  variant = "default",
}: LanguageSwitcherProps) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Don't render anything until we're on the client
  if (!isMounted) {
    return null;
  }

  const languages = [
    { code: "en-IN", name: t("english") },
    { code: "hn-IN", name: t("hinglish") },
  ];

  const isFooter = variant === "footer";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "text-sm font-medium",
          isFooter ? "text-white/80" : "text-foreground",
        )}
      >
        {t("language")}:
      </span>

      <NativeSelect
        value={currentLanguage}
        onChange={(e) => {
          changeLanguage(e.target.value);
          window.location.reload();
        }}
        className={cn(
          isFooter &&
            "bg-white/10 border-white/20 text-white focus-visible:ring-white/30",
        )}
        size="sm"
      >
        {languages.map((lang) => (
          <NativeSelectOption
            key={lang.code}
            value={lang.code}
            className="text-black"
          >
            {lang.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};
