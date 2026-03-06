"use client";

import { UserLoginMobileOtpForm } from "@/components/layouts/auth/user-login-mobile-otp-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useSearchParams } from "next/navigation";

export default function AuthLogin() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-[#F5F7FA]">
      <div className="w-full max-w-[1200px] md:h-[750px] flex flex-col lg:flex-row rounded-3xl overflow-hidden bg-[#3D52A0] shadow-2xl relative">
        {/* Left Pane - Image */}
        <div className="hidden lg:flex relative w-1/2 h-full p-4">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/login.png"
              alt="E-con Building Centre"
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
              <h1 className="text-4xl text-white font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                E-con Building Centre
              </h1>
              
              <div className="space-y-6 mt-auto mb-[80px]">
                <h2 className="text-3xl text-white/90 font-medium leading-tight">
                  Powered by Engineers<br />
                  Trusted by Families.
                </h2>
                <div className="flex gap-2">
                  <span className="w-8 h-1 bg-white/40 mb-4 rounded-full"></span>
                  <span className="w-8 h-1 bg-white/40 mb-4 rounded-full"></span>
                  <span className="w-8 h-1 bg-white mb-4 rounded-full"></span>
                </div>
              </div>

              <div className="absolute bottom-10 left-10">
                <Link href="/">
                  <button type="button" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white font-medium transition-all shadow-lg active:scale-95">
                    <ArrowLeft className="h-4 w-4" />
                    {t("back")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative py-16 lg:py-0 overflow-y-auto lg:overflow-visible">
          {/* Mobile Back Button */}
          <div className="lg:hidden absolute top-6 left-6">
            <Link href="/" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">{t("back_to_home")}</span>
            </Link>
          </div>

          <div className="w-full max-w-md mt-6 lg:mt-0">
            <UserLoginMobileOtpForm role={role || undefined} isDarkTheme={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
