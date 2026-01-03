import React from "react";

interface BrowseLayoutProps {
  sidebar: React.ReactNode;
  search: React.ReactNode;
  results: React.ReactNode;
}

export function BrowseLayout({ sidebar, search, results }: BrowseLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Hidden on mobile, handled via drawer in Search component or separate mobile trigger if preferred. 
            For this layout, we'll assume it's visible on large screens. */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">{sidebar}</div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          <div className="flex flex-col gap-6">
            <div className="md:sticky md:top-20 md:z-10 md:bg-background/95 md:backdrop-blur-sm md:py-2">
              {search}
            </div>

            {results}
          </div>
        </main>
      </div>
    </div>
  );
}
