"use client";

import { BrowseLayout } from "@/components/layouts/browse/browse.layout";
import { Results } from "@/components/layouts/browse/results";
import { Search } from "@/components/layouts/browse/search";
import { Sidebar } from "@/components/layouts/browse/sidebar";
import { useBrowseParams } from "@/hooks/useBrowseParams";
import { useBrowseData } from "@/queries/browse.queries";
import { useBrowseStore } from "@/store/browseStore";
import React, { Suspense, useEffect } from "react";

function BrowsePageContent() {
  const { params } = useBrowseParams();
  const { data, isLoading } = useBrowseData(params);
  const setBrowseData = useBrowseStore((state) => state.setBrowseData);

  // Sync data to global store
  useEffect(() => {
    if (data) {
      setBrowseData({
        products: data.products,
        facets: data.facets,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    }
  }, [data, setBrowseData]);

  return (
    <BrowseLayout
      sidebar={<Sidebar facets={data?.facets} isLoading={isLoading} />}
      search={<Search facets={data?.facets} />}
      // Results now reads from store internaly, just pass loading state
      results={<Results isLoading={isLoading} />}
    />
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
