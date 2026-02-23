"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Scan,
  Settings,
  Bell,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

/**
 * 1. Buyer Profile Card (Orange)
 */
export function BuyerProfileCard({ 
  name, 
  role, 
  avatarUrl 
}: { 
  name: string; 
  role: string; 
  avatarUrl?: string 
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF8C00] to-[#FFA500] p-4 sm:p-8 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-2 sm:border-4 border-white/30 shadow-xl">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-white text-[#FFA500] text-xl sm:text-3xl font-bold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm sm:text-lg font-medium text-white/80">{role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30">
            <Scan className="size-5 sm:size-6 text-white" />
          </button>
          <button className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30">
            <Settings className="size-5 sm:size-6 text-white" />
          </button>
          <button className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30">
            <Bell className="size-5 sm:size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Room Card
 */
export function RoomCard({ 
  title, 
  icon: Icon, 
  href 
}: { 
  title: string; 
  icon: React.ElementType; 
  href: string 
}) {
  return (
    <div className="group flex flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-muted/50 transition-all hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFA500] text-white">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-bold text-[#3D52A0]">{title}</h3>
      <Link href={href} className="w-full">
        <Button className="w-full bg-[#2A3B7D] hover:bg-[#1D2A5C] text-xs font-semibold uppercase tracking-wider h-10">
          Browse Area
        </Button>
      </Link>
    </div>
  );
}

/**
 * 3. Activity Container Card
 */
export function ActivitySectionCard({ 
  title, 
  icon: Icon, 
  children,
  footerLink,
  footerText
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  footerLink: string;
  footerText: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-[#0F28A9] text-white shadow-xl">
      <div className="flex items-center justify-center gap-3 p-6 pb-4">
        <Icon className="size-8" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="flex-1 px-6">
        <div className="grid grid-cols-2 gap-4">
          {children}
        </div>
      </div>
      
      <div className="p-6">
        <Link href={footerLink}>
          <Button className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold h-12 text-md">
            {footerText}
          </Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * 4. Stat Card (Inside Activity)
 */
export function ActivityStatCard({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType 
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-[#3D52A0] shadow-inner">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[#FFA500]" />
        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{label}</span>
      </div>
      <span className="text-4xl font-extrabold">{value}</span>
    </div>
  );
}

/**
 * 5. Conference Hall Section Item
 */
export function ConferenceHallItem({ 
  title, 
  icon: Icon, 
  href 
}: { 
  title: string; 
  icon: React.ElementType; 
  href: string 
}) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-xl bg-[#4D65B2] p-4 text-white transition-all hover:bg-[#3D52A0]">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
          <Icon className="size-5" />
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider opacity-60">
        <span>View More</span>
        <ArrowRight className="size-2 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
