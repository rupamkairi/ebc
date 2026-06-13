"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useItemsQuery } from "@/queries/catalogQueries";
import { Item } from "@/types/catalog";

function useDebouncedValue(value: string, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}

interface SearchInputProps {
  query: string;
  isFocused: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  mobile?: boolean;
  onClear: () => void;
  onFocus: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

function SearchInput({
  query,
  isFocused,
  inputRef,
  mobile = false,
  onClear,
  onFocus,
  onKeyDown,
  onQueryChange,
  onSubmit,
}: SearchInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "relative flex items-center rounded-full border transition-all duration-200 ease-out",
        mobile
          ? "h-12 flex-1 border-transparent bg-slate-100 focus-within:border-secondary/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-secondary/5"
          : "hidden h-11 w-60 border-slate-200 bg-slate-50/70 md:flex lg:w-72",
        !mobile &&
          (isFocused
            ? "border-secondary/50 bg-white shadow-md ring-4 ring-secondary/5"
            : "hover:bg-slate-100/60"),
      )}
    >
      <Search
        className={cn(
          "pointer-events-none absolute left-4 h-4 w-4 shrink-0 transition-colors",
          isFocused ? "text-secondary" : "text-slate-400",
        )}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={
          mobile || isFocused ? "Search construction needs..." : "Search..."
        }
        className="h-full w-full bg-transparent pl-10 pr-10 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
        aria-label="Search catalog"
        autoComplete="off"
      />
      {query && (
        <button
          type="button"
          onClick={onClear}
          className={cn(
            "absolute right-3.5 rounded-full text-slate-400 transition-colors hover:text-slate-600",
            mobile ? "p-1 hover:bg-slate-200" : "p-0.5 hover:bg-slate-100",
          )}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}

interface SearchResultsProps {
  query: string;
  results: Item[];
  loading: boolean;
  highlightedIndex: number;
  onSelect: (item: Item) => void;
}

function SearchResults({
  query,
  results,
  loading,
  highlightedIndex,
  onSelect,
}: SearchResultsProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white shadow-lg">
      <div className="border-b px-3 py-2 text-xs font-semibold text-slate-500">
        Search results
      </div>
      <div className="max-h-[320px] overflow-y-auto p-1">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </div>
        ) : results.length > 0 ? (
          results.map((item, index) => {
            const meta = [item.category?.name, item.brand?.name]
              .filter(Boolean)
              .join(" - ");

            return (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(item)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors",
                  highlightedIndex === index
                    ? "bg-secondary/10 text-slate-950"
                    : "hover:bg-slate-50",
                )}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {item.name}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                    {meta || "Catalog item"}
                  </span>
                </span>
              </button>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {query.trim().length >= 2
              ? "No matching catalog items found."
              : "Type at least 2 characters to search."}
          </div>
        )}
      </div>
    </div>
  );
}

export function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query);
  const searchTerm = debouncedQuery.trim();
  const shouldSearch = searchTerm.length >= 2;

  const { data: items = [], isLoading } = useItemsQuery({
    search: shouldSearch ? searchTerm : undefined,
    perPage: 8,
    enabled: shouldSearch,
  });

  const results = useMemo(() => items.slice(0, 8), [items]);
  const resultsOpen =
    (isFocused || showMobileSearch) && (query.trim().length > 0 || isLoading);

  useEffect(() => {
    if (showMobileSearch) {
      window.setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [showMobileSearch]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setHighlightedIndex(0);
  };

  const closeSearch = () => {
    setIsFocused(false);
    setShowMobileSearch(false);
    desktopInputRef.current?.blur();
    mobileInputRef.current?.blur();
  };

  const submitSearch = () => {
    const trimmed = query.trim();
    router.push(trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : "/browse");
    closeSearch();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitSearch();
  };

  const handleSelect = (item: Item) => {
    router.push(`/browse/${item.id}`);
    closeSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }

    if (event.key === "Enter" && (!resultsOpen || results.length === 0)) {
      event.preventDefault();
      submitSearch();
      return;
    }

    if (!resultsOpen || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(
        (index) => (index - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(results[highlightedIndex]);
    }
  };

  const handleClear = () => {
    setQuery("");
    desktopInputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  const popoverContent = (
    <PopoverContent
      align="start"
      sideOffset={8}
      onOpenAutoFocus={(event) => event.preventDefault()}
      className="w-[var(--radix-popover-trigger-width)] min-w-[18rem] p-0"
    >
      <SearchResults
        query={query}
        results={results}
        loading={isLoading}
        highlightedIndex={highlightedIndex}
        onSelect={handleSelect}
      />
    </PopoverContent>
  );

  return (
    <>
      <Popover open={resultsOpen} onOpenChange={(open) => !open && closeSearch()}>
        <PopoverAnchor asChild>
          <div className="hidden md:block">
            <SearchInput
              query={query}
              isFocused={isFocused}
              inputRef={desktopInputRef}
              onClear={handleClear}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              onQueryChange={handleQueryChange}
              onSubmit={handleSubmit}
            />
          </div>
        </PopoverAnchor>
        {!showMobileSearch && popoverContent}
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowMobileSearch(true)}
        className="flex h-10 w-10 rounded-full text-slate-600 transition-all hover:bg-slate-100 active:scale-95 md:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Button>

      {showMobileSearch && (
        <div className="absolute inset-x-0 top-0 z-50 flex h-24 animate-in items-center gap-3 border-b border-slate-100 bg-white px-4 slide-in-from-top duration-200">
          <button
            type="button"
            onClick={closeSearch}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition-all hover:bg-slate-100 active:scale-95"
            aria-label="Close search"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <Popover open={resultsOpen} onOpenChange={(open) => !open && closeSearch()}>
            <PopoverAnchor asChild>
              <div className="flex flex-1">
                <SearchInput
                  query={query}
                  isFocused={isFocused || showMobileSearch}
                  inputRef={mobileInputRef}
                  mobile
                  onClear={handleClear}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  onQueryChange={handleQueryChange}
                  onSubmit={handleSubmit}
                />
              </div>
            </PopoverAnchor>
            {popoverContent}
          </Popover>
        </div>
      )}
    </>
  );
}
