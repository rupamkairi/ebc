"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSessionQuery } from "@/queries/authQueries";
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

              {user && !isAdmin && (
                <Link href={getDashboardLink()}>
                  <Avatar className="h-10 w-10 border-2 border-[#FFA500] hover:opacity-80 transition-opacity cursor-pointer">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="bg-[#445EB4] text-white">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>

            {mobileMenu}
          </div>
        </div>
      </Container>
    </header>
  );
}
