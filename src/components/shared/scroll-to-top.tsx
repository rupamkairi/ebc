"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-[90px] md:bottom-[100px] right-6 z-50 transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
      <Button 
        onClick={scrollToTop}
        size="icon"
        className="h-12 w-12 rounded-full bg-white text-[#3B5998] hover:bg-slate-100 hover:text-[#2B427A] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 transition-all active:scale-95 flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" />
      </Button>
    </div>
  );
}
