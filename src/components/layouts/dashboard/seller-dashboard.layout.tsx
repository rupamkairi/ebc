"use client";

import Container from "@/components/ui/containers";
import { SellerDashboardHeader } from "@/components/layouts/dashboard/seller-dashboard-header";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { openSupportCenter } from "@/lib/support-center";
import { useLanguage } from "@/hooks/useLanguage";

export default function SellerDashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <AppThemeProvider variant="app">
      <div className="min-h-screen bg-muted/30">
        <SellerDashboardHeader />
        <div className="flex flex-col gap-6 py-6">
          <Container>
            {children}
            <section className="mt-10 flex justify-center border-t py-10">
              <Button variant="glow" size="action" className="group" onClick={openSupportCenter}>
                {t("faq_still_questions")}
                <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </section>
          </Container>
        </div>
      </div>
    </AppThemeProvider>
  );
}
