"use client";

import * as React from "react";
import {
  Home,
  BookOpen,
  FileText,
  Wallet,
  HeadphonesIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Home",
    url: "/buyer-dashboard",
    icon: Home,
  },
  {
    title: "My catalogue",
    url: "/buyer-dashboard/catalogue",
    icon: BookOpen,
  },
  {
    title: "Enquiries",
    url: "/buyer-dashboard/enquiries",
    icon: FileText,
  },
  {
    title: "Wallet",
    url: "/buyer-dashboard/wallet",
    icon: Wallet,
  },
  {
    title: "Support",
    url: "/buyer-dashboard/support",
    icon: HeadphonesIcon,
  },
];

export function SidebarItems({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  
  return (
    <SidebarMenu className="gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.url;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                "h-12 px-6 transition-all duration-200 group",
                isActive 
                  ? "bg-[#3D52A0] text-white hover:bg-[#3D52A0] hover:text-white rounded-none border-r-4 border-[#3D52A0]" 
                  : "text-muted-foreground hover:bg-muted/50 rounded-none border-b border-muted/20"
              )}
              tooltip={item.title}
              onClick={onItemClick}
            >
              <Link href={item.url} className="flex items-center gap-4">
                <item.icon className={cn("size-5", isActive ? "text-white" : "text-muted-foreground")} />
                <span className="font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function BuyerDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" className="border-r bg-white w-64 hidden lg:flex" {...props}>
      <SidebarContent className="py-8">
        <SidebarGroup>
          <SidebarItems />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
