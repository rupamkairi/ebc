"use client";

import { Home, PlusCircle, FileText, Calendar, Headphones } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/buyer-dashboard" },
  { icon: PlusCircle, label: "Post", href: "/buyer-dashboard/enquiries/new" },
  { icon: FileText, label: "Quotes", href: "/buyer-dashboard/quotations" },
  { icon: Calendar, label: "Events", href: "#" },
  { icon: Headphones, label: "Support", href: "#" },
];

export function BuyerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4">
      <nav className="flex items-center gap-1 bg-white border border-border px-4 py-2 rounded-2xl shadow-xl max-w-fit overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center min-w-[72px] py-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-foreground/60 hover:text-primary hover:bg-muted"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="h-1 w-8 bg-primary rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
