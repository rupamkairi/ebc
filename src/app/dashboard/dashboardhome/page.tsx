"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import notificationbook from "../../../../public/icons/to-do-list.png";
import notificationhome from "../../../../public/icons/notification.png";

import Image from "next/image";
import DashboardHeader from "../DashboardHeader";

export default function DashboardHome() {
  return (
    <div className="space-y-10">
      <DashboardHeader />
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-3 gap-5">
        <Link href="/dashboard/new-buyer" className="block">
          <Card className="rounded-2xl bg-[#08589e] text-white shadow-lg border-none cursor-pointer hover:scale-[1.01] transition-all overflow-hidden p-6">
            <div className="flex gap-7 items-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <Image
                  src={notificationbook}
                  width={60}
                  height={60}
                  alt="document bell"
                />
              </div>

              <h3 className="text-[32px] font-bold w-[70%] leading-[1.15]">
                Naye Buyer RFQs Receive karein
              </h3>
            </div>

            <div className="flex gap-4">
              <p className="text-[22px] leading-[1.15]">
                <span className="text-3xl font-bold mr-2">→</span>
                Local dealers/retailers se direct demand milegi.
              </p>

              {/* RIGHT SIDE BIG ILLUSTRATION */}
              <div className="opacity-90">
                <Image
                  src={notificationhome}
                  width={170}
                  // height={130}
                  alt="local shop"
                />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/new-buyer" className="block">
          <Card className="rounded-2xl bg-[#ee7b0f] text-white shadow-lg border-none cursor-pointer hover:scale-[1.01] transition-all overflow-hidden p-6">
            <div className="flex gap-7 items-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <Image
                  src={notificationbook}
                  width={60}
                  height={60}
                  alt="document bell"
                />
              </div>

              <h3 className="text-[32px] font-bold w-[70%] leading-[1.15]">
                Price quote bhejein with T&C
              </h3>
            </div>

            <div className="flex gap-4">
              <p className="text-[22px]">
                <span className="text-3xl font-bold mr-2 leading-[1.15]">
                  →
                </span>
                Faster response = Highest chances of winning.
              </p>

              {/* RIGHT SIDE BIG ILLUSTRATION */}
              <div className="opacity-90">
                <Image
                  src={notificationhome}
                  width={170}
                  // height={130}
                  alt="local shop"
                />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/new-buyer" className="block">
          <Card className="rounded-2xl bg-[#1bad70] text-white shadow-lg border-none cursor-pointer hover:scale-[1.01] transition-all overflow-hidden p-6">
            <div className="flex gap-7 items-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <Image
                  src={notificationbook}
                  width={60}
                  height={60}
                  alt="document bell"
                />
              </div>

              <h3 className="text-[32px] font-bold w-[70%] leading-[1.15]">
                Manage product catalog
              </h3>
            </div>

            <div className="flex gap-4">
              <p className="text-[22px]">
                Apna cement, steel, brick, tile, waterprofing etc. Ka catalog
                add/update karein.
              </p>

              {/* RIGHT SIDE BIG ILLUSTRATION */}
              <div className="opacity-90">
                <Image src={notificationhome} width={170} alt="local shop" />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/new-buyer" className="block">
          <Card className="rounded-2xl bg-[#834ec8] text-white shadow-lg border-none cursor-pointer hover:scale-[1.01] transition-all overflow-hidden p-6">
            <div className="flex gap-7 items-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <Image
                  src={notificationbook}
                  width={60}
                  height={60}
                  alt="document bell"
                />
              </div>

              <h3 className="text-[32px] font-bold w-[70%] leading-[1.15]">
                Promotion (Conference Hall)
              </h3>
            </div>

            <div className="flex gap-4">
              <p className="text-[22px]">
                Dealer network ke liye offers, announcements, technical
                brochures upload karein.
              </p>

              {/* RIGHT SIDE BIG ILLUSTRATION */}
              <div className="opacity-90">
                <Image
                  src={notificationhome}
                  width={170}
                  // height={130}
                  alt="local shop"
                />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/new-buyer" className="block">
          <Card className="rounded-2xl bg-[#4E54C8] text-white shadow-lg border-none cursor-pointer hover:scale-[1.01] transition-all overflow-hidden p-6">
            <div className="flex gap-7 items-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <Image
                  src={notificationbook}
                  width={60}
                  height={60}
                  alt="document bell"
                />
              </div>

              <h3 className="text-[32px] font-bold w-[70%] leading-[1.15]">
                Naye Buyer RFQs Receive karein
              </h3>
            </div>

            <div className="flex gap-4">
              <p className="text-[22px]">
                <span className="text-3xl font-bold mr-2 leading-[1.15]">
                  →
                </span>
                Local dealers/retailers se direct demand milegi.
              </p>

              {/* RIGHT SIDE BIG ILLUSTRATION */}
              <div className="opacity-90">
                <Image
                  src={notificationhome}
                  width={170}
                  // height={130}
                  alt="local shop"
                />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/new-buyer" className="block">
          <Card className="rounded-2xl bg-[#eea00f] text-white shadow-lg border-none cursor-pointer hover:scale-[1.01] transition-all overflow-hidden p-6">
            <div className="flex gap-7 items-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <Image
                  src={notificationbook}
                  width={60}
                  height={60}
                  alt="document bell"
                />
              </div>

              <h3 className="text-[32px] font-bold w-[70%] leading-[1.15]">
                Naye Buyer RFQs Receive karein
              </h3>
            </div>

            <div className="flex gap-4">
              <p className="text-[22px]">
                <span className="text-3xl font-bold mr-2 leading-[1.15]">
                  →
                </span>
                Local dealers/retailers se direct demand milegi.
              </p>

              <div className="opacity-90">
                <Image
                  src={notificationhome}
                  width={170}
                  // height={130}
                  alt="local shop"
                />
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
