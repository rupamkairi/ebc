"use client";

import Container from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSessionQuery } from "@/queries/authQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  ADMIN_ROLES,
  SELLER_ROLES,
  BUYER_ROLES,
  USER_ROLE,
} from "@/constants/roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { LogOut, Settings, LayoutDashboard } from "lucide-react";

interface UnifiedHeaderProps {
  variant?: "public" | "buyer" | "seller";
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  mobileMenu?: React.ReactNode;
  leftMobileMenu?: React.ReactNode;
  className?: string;
}

export function UnifiedHeader({
  variant = "public",
  centerContent,
  rightContent,
  mobileMenu,
  leftMobileMenu,
  className,
}: UnifiedHeaderProps) {
  const { data: sessionData } = useSessionQuery();
  const user = sessionData?.user;
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];

  const displayName = mainEntity?.name || user?.name || "Member";
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const isAdmin = user?.role && ADMIN_ROLES.includes(user.role as USER_ROLE);
  const isSeller = user?.role && SELLER_ROLES.includes(user.role as USER_ROLE);
  const isBuyer = user?.role && BUYER_ROLES.includes(user.role as USER_ROLE);

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isSeller) return "/seller-dashboard";
    if (isBuyer) return "/buyer-dashboard";
    return "/";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white shadow-sm transition-all duration-300",
        className,
      )}
    >
      <Container size="xl">
        <div className="flex h-24 items-center justify-between">
          <div className="flex shrink-0 items-center">
            {leftMobileMenu}
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-44">
                <Image
                  src="/logo.svg"
                  alt="E-CON Building Centre"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-2">
            {centerContent}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              {rightContent}

              {!user && variant === "public" && (
                <>
                  <span className="text-sm font-medium text-slate-600 mr-1">
                    Join As
                  </span>
                  <Link href="/auth/register?role=SELLER">
                    <Button className="bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg px-6 h-10 border-none shadow-sm">
                      Seller
                    </Button>
                  </Link>
                  <Link href="/auth/register?role=BUYER">
                    <Button className="bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg px-6 h-10 border-none shadow-sm">
                      Buyer
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {user && !isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 border-2 border-[#FFA500] hover:opacity-80 transition-opacity cursor-pointer">
                    <AvatarImage src={user.image || ""} alt={displayName} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-lg">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center w-full"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {(isSeller || isBuyer) && (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link
                        href={
                          isSeller
                            ? "/seller-dashboard/settings"
                            : "/buyer-dashboard/settings"
                        }
                        className="flex items-center w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {mobileMenu}
          </div>
        </div>
      </Container>
    </header>
  );
}
