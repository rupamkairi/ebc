import React from "react";

interface BrowseLayoutProps {
  sidebar: React.ReactNode;
  search: React.ReactNode;
  results: React.ReactNode;
}

export function BrowseLayout({
  sidebar,
  search,
  results,
}: BrowseLayoutProps) {
  return (
    <div className="w-full bg-[#f8faff] min-h-screen">
      <div className="max-w-[1800px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Filters (Materials) */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-24">{sidebar}</div>
        </aside>

        {/* Center Column: Search & Results */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-8">
            <div className="w-full">{search}</div>
            {results}
          </div>
        </main>
      </div>
    </div>
  );
}
