"use client";

import { IconInnerShadowTop } from "@tabler/icons-react";
import {
  BarChart3,
  ChevronRight,
  FileBox,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  MessageSquare,
} from "lucide-react";
import * as React from "react";

// import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/constants/enums";
import Link from "next/link";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Admins",
      url: "#",
      icon: ShieldCheck,
      isActive: true,
      color: "text-foreground",
      items: [
        { title: "Managers", url: "/admin-dashboard/admin-managers" },
        { title: "Accountants", url: "/admin-dashboard/admin-accountants" },
        { title: "Executives", url: "/admin-dashboard/admin-executives" },
      ],
    },
    {
      title: "Sellers & Providers",
      url: "#",
      icon: Store,
      color: "text-foreground",
      items: [
        {
          title: "Product Sellers",
          url: "/admin-dashboard/sellers/product-sellers",
        },
        {
          title: "Service Providers",
          url: "/admin-dashboard/sellers/service-providers",
        },
        {
          title: "Wallets",
          url: "/admin-dashboard/wallets",
        },
        {
          title: "Costs",
          url: "/admin-dashboard/costs",
        },
      ],
    },
    {
      title: "Buyers & Consumers",
      url: "#",
      icon: Users,
      color: "text-foreground",
      items: [{ title: "Buyers", url: "/admin-dashboard/buyers" }],
    },
    {
      title: "Catalog",
      url: "#",
      icon: FileBox,
      color: "text-foreground",
      items: [
        { title: "Categories", url: "/admin-dashboard/catalog/categories" },
        { title: "Brands", url: "/admin-dashboard/catalog/brands" },
        {
          title: "Specifications",
          url: "/admin-dashboard/catalog/specifications",
        },
        { title: "Items", url: "/admin-dashboard/catalog/items" },
      ],
    },
    {
      title: "Conference Hall",
      url: "#",
      icon: FileBox,
      color: "text-foreground",
      items: [
        { title: "Offers", url: "/admin-dashboard/conference-hall/offers" },
        { title: "Content", url: "/admin-dashboard/conference-hall/content" },
        { title: "Events", url: "/admin-dashboard/conference-hall/events" },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart3,
      color: "text-foreground",
      items: [
        { title: "General", url: "#" },
        { title: "Reviews Moderation", url: "/admin-dashboard/reviews" },
      ],
    },
    {
      title: "AI",
      url: "#",
      icon: Sparkles,
      color: "text-foreground",
      items: [
        { title: "Conference Hall", url: "#" },
        { title: "Calculators", url: "/admin-dashboard/ai/calculator" },
      ],
    },
    {
      title: "Support Center",
      url: "/admin-dashboard/support",
      icon: MessageSquare,
      color: "text-foreground",
    },
    {
      title: "Settings",
      url: "/admin-dashboard/settings",
      icon: Settings,
      color: "text-foreground",
      items: [{ title: "Notificaitons", url: "/admin-dashboard/settings" }],
    },
  ],
};

export function AdminDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const role = user?.role?.toUpperCase();

  const filteredNavMain = data.navMain
    .map((group) => {
      if (group.title === "Admin") {
        const filteredItems = group.items?.filter((item) => {
          // Admin (Super Admin) sees everything
          if (role === USER_ROLE.ADMIN) return true;

          if (role === USER_ROLE.ADMIN_MANAGER) {
            // Manager hides Accountants
            return item.title !== "Accountants";
          }
          if (role === USER_ROLE.ADMIN_ACCOUNTANT) {
            // Accountant hides Managers and Executives
            return item.title !== "Managers" && item.title !== "Executives";
          }
          if (role === USER_ROLE.ADMIN_EXECUTIVE) {
            // Executive hides Managers, Accountants, and Executives
            return (
              item.title !== "Managers" &&
              item.title !== "Accountants" &&
              item.title !== "Executives"
            );
          }
          return true;
        });
        return { ...group, items: filteredItems };
      }
      return group;
    })
    .filter((group) => !group.items || group.items.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <img
                  src="/logo.svg"
                  alt="E-CON Building Centre"
                  className="size-6 object-contain"
                />
                <span className="text-base font-semibold">
                  E-CON Building Centre
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className={item.color} />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/*<NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>{/*<NavUser user={data.user} />*/}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
