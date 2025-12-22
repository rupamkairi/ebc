"use client";

import { Home, PlusCircle, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/buyer-dashboard" },
  { icon: PlusCircle, label: "Post", href: "/buyer-dashboard/enquiries/new" },
  { icon: FileText, label: "Quotes", href: "/buyer-dashboard/quotations" },
  { icon: Calendar, label: "Events", href: "#" },
  { icon: User, label: "Profile", href: "#" },
];

export function BuyerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <nav className="flex items-center gap-1 bg-white/80 backdrop-blur-lg border border-border/50 px-4 py-2 rounded-2xl shadow-2xl max-w-fit overflow-x-auto no-scrollbar pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center min-w-[72px] py-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary bg-primary/5 shadow-inner"
                  : "text-foreground/60 hover:text-primary hover:bg-muted/50"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="h-1 w-6 bg-primary rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
