"use client";

import {
  Home,
  Package,
  Users,
  Headphones,
  Wallet,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isServiceBusiness } from "@/constants/roles";
import { useLanguage } from "@/hooks/useLanguage";
import { useSessionQuery } from "@/queries/authQueries";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data: user } = useSessionQuery();
  const isServiceProvider = isServiceBusiness(user?.user?.role);

  const navItems = [
    { icon: Home, label: t("home", "Home"), href: "/seller-dashboard" },
    {
      icon: Package,
      label: t("catalog", "Catalog"),
      href: "/seller-dashboard/catalog",
    },
    isServiceProvider
      ? {
          icon: CalendarDays,
          label: t("appointments", "Appointments"),
          href: "/seller-dashboard/appointments",
        }
      : {
          icon: Users,
          label: t("enquiries", "Enquiries"),
          href: "/seller-dashboard/enquiries",
        },
    {
      icon: Wallet,
      label: t("wallet", "Wallet"),
      href: "/seller-dashboard/wallet",
    },
    {
      icon: Headphones,
      label: t("support", "Support"),
      href: "/seller-dashboard/support",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 bg-background/80 backdrop-blur-lg border px-3 py-2 rounded-full shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center min-w-[64px] py-1.5 px-2 rounded-full transition-all hover:bg-muted",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
