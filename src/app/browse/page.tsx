"use client";

import { BrowseLayout } from "@/components/layouts/browse/browse.layout";
import { Results } from "@/components/layouts/browse/results";
import { Search } from "@/components/layouts/browse/search";
import { Sidebar } from "@/components/layouts/browse/sidebar";
import { useBrowseParams } from "@/hooks/useBrowseParams";
import { useBrowseData } from "@/queries/browse.queries";
import { useBrowseStore } from "@/store/browseStore";
import React, { Suspense, useEffect } from "react";

import { Navbar } from "@/components/shared/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { FloatingInquiryButton } from "@/components/layouts/browse/floating-inquiry-button";

function BrowsePageContent() {
  const { params } = useBrowseParams();
  const { data, isLoading } = useBrowseData(params);
  const setBrowseData = useBrowseStore((state) => state.setBrowseData);

  // Sync data to global store
  useEffect(() => {
    if (data) {
      setBrowseData({
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories,
        facets: data.facets,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    }
  }, [data, setBrowseData]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <BrowseLayout
          sidebar={
            <Sidebar 
              categories={data?.categories} 
              facets={data?.facets} 
              isLoading={isLoading} 
            />
          }
          search={<Search categories={data?.categories} facets={data?.facets} />}
          // Results now reads from store internaly, just pass loading state
          results={<Results isLoading={isLoading} />}
        />
      </main>
      <FooterSection />
      <WhatsAppButton />
      <FloatingInquiryButton />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <BrowsePageContent />
    </Suspense>
  );
}
