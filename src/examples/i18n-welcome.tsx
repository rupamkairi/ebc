"use client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

export function I18NWelcome() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto rounded-xl shadow-md p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("welcome")} 👋</h1>
          <LanguageSwitcher />
        </header>
      </div>
    </div>
  );
}
