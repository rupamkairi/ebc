"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <header className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("welcome")} 👋
          </h1>
          <LanguageSwitcher />
        </header>
      </div>
    </div>
  );
}
