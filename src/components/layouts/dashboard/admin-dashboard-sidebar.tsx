"use client";

import { IconInnerShadowTop } from "@tabler/icons-react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
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
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Admin",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Managers", url: "/admin-dashboard/admin-managers" },
        { title: "Accountants", url: "/admin-dashboard/admin-accountants" },
        { title: "Executives", url: "/admin-dashboard/admin-executives" },
      ],
    },
    {
      title: "Sellers",
      url: "#",
      icon: Bot,
      items: [
        { title: "Product Managers", url: "#" },
        { title: "Service Providers", url: "#" },
      ],
    },
    {
      title: "Buyers",
      url: "#",
      icon: Bot,
      items: [{ title: "Buyers", url: "#" }],
    },
    {
      title: "Catalog",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Categories", url: "/admin-dashboard/catalog/categories" },
        {
          title: "Sub Categories",
          url: "/admin-dashboard/catalog/sub-categories",
        },
        { title: "Brands", url: "/admin-dashboard/catalog/brands" },
        {
          title: "Specifications",
          url: "/admin-dashboard/catalog/specifications",
        },
        { title: "Items", url: "/admin-dashboard/catalog/items" },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
    {
      title: "AI",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Conference Hall", url: "#" },
        { title: "Calculators", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
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
          if (role === "ADMIN") return true;

          if (role === "ADMIN_MANAGER") {
            // Manager hides Accountants
            return item.title !== "Accountants";
          }
          if (role === "ADMIN_ACCOUNTANT") {
            // Accountant hides Managers and Executives
            return item.title !== "Managers" && item.title !== "Executives";
          }
          if (role === "ADMIN_EXECUTIVE") {
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
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">EBC Marketplace</span>
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
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
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
