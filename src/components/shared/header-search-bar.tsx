"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial query from URL search params
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  // Focus mobile input when mobile search is triggered
  useEffect(() => {
    if (showMobileSearch) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [showMobileSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/browse?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/browse");
    }
    setIsFocused(false);
    setShowMobileSearch(false);
    desktopInputRef.current?.blur();
    mobileInputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    desktopInputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  return (
    <>
      {/* DESKTOP SEARCH: Expanding Pill */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "hidden md:flex relative items-center h-11 rounded-full border border-slate-200 bg-slate-50/70 transition-all duration-200 ease-out",
          "w-60 lg:w-72",
          isFocused
            ? "bg-white border-secondary/50 shadow-md ring-4 ring-secondary/5"
            : "hover:bg-slate-100/60"
        )}
      >
        <Search className={cn(
          "absolute left-4 h-4 w-4 shrink-0 transition-colors pointer-events-none",
          isFocused ? "text-secondary" : "text-slate-400"
        )} />
        <input
          ref={desktopInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={isFocused ? "Search services & materials..." : "Search..."}
          className="w-full h-full pl-10 pr-10 bg-transparent text-sm font-semibold focus:outline-none placeholder-slate-400 text-slate-700"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* MOBILE TRIGGER BUTTON: Placed inline next to other icons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowMobileSearch(true)}
        className="flex md:hidden h-10 w-10 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* MOBILE FULL-WIDTH OVERLAY: Slides down smoothly over the header */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-0 z-50 h-24 bg-white border-b border-slate-100 flex items-center px-4 gap-3 animate-in slide-in-from-top duration-200">
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <form onSubmit={handleSubmit} className="relative flex-1 flex items-center h-12 bg-slate-100 rounded-full border border-transparent focus-within:bg-white focus-within:border-secondary/50 focus-within:ring-4 focus-within:ring-secondary/5 transition-all">
            <Search className="absolute left-4 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services & materials..."
              className="w-full h-full pl-11 pr-11 bg-transparent text-sm font-semibold focus:outline-none placeholder-slate-400 text-slate-700"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3.5 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
