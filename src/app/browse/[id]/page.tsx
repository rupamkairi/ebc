"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useItemQuery } from "@/queries/catalogQueries";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ForumSection } from "@/components/shared/forum";
import { Header } from "@/components/shared/header";
import { FooterSection } from "@/components/landing/footer-section";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import Container from "@/components/ui/containers";
import { useLanguage } from "@/hooks/useLanguage";

export default function ItemDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: item, isLoading, error } = useItemQuery(id);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">{t("loading_item_details")}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-destructive">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>{t("failed_load_item")}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            {t("retry")}
          </Button>
        </div>
      );
    }

    if (!item) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className="text-xl font-semibold">{t("item_not_found")}</p>
          <Button onClick={() => router.push("/browse")} className="mt-4">
            {t("go_browse")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 pt-6 animate-in fade-in duration-500">
        <Button
          variant="ghost"
          className="pl-0 gap-2 hover:bg-transparent hover:text-primary transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-[#445EB4] tracking-tight">
            {item.name}
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            {t("item_id")}: <span className="text-slate-600">{item.id}</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <h2 className="text-xl font-black text-[#445EB4] mb-4">
            {t("raw_details")}
          </h2>
          <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-[600px] border border-slate-100 text-slate-700 font-mono">
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>

        <div className="pt-10 border-t border-slate-100">
          <ForumSection itemId={id} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faff]">
      <Header />
      <main className="flex-1 py-10">
        <Container size="lg">{renderContent()}</Container>
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
