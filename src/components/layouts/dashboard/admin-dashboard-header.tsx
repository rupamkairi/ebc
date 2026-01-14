"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminDashboardUser } from "@/components/layouts/dashboard/admin-dashboard-user";
import { MediaUploader } from "@/components/shared/upload";
import { PATH_BREADCRUMBS } from "@/lib/path-breadcrumbs";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.map((segment, index) => {
                const label =
                  PATH_BREADCRUMBS[segment] ||
                  segment.charAt(0).toUpperCase() +
                    segment.slice(1).replace(/-/g, " ");
                const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                const isLast = index === pathSegments.length - 1;

                return (
                  <React.Fragment key={href}>
                    <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-3 pr-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-500 hover:text-blue-600"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </Button>
          <MediaUploader />
          <Separator orientation="vertical" className="h-4" />
          <AdminDashboardUser />
        </div>
      </div>
    </header>
  );
}
