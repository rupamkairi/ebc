"use client";

import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer 
      style={{ background: 'linear-gradient(to bottom, #3B52B1, #19234B)' }}
      className="text-white py-8 border-t-4 border-secondary"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-white"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">EBC</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Powered by Engineers. Trusted by Families. <br />
              Made in India • Built for ALL.
            </p>
          </div>
          <div>
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs mb-4">{t("quick_links")}</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("materials")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("services")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("engineer_support")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("how_it_works")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs mb-4">{t("company")}</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("about_us")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("contact_us")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("privacy_policy")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("terms_of_service")}</Link></li>
              <li><Link href="/auth/admin-login" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs mb-4">{t("contact_info")}</h4>
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-300">info@ebc.com</p>
              <p className="text-sm font-bold text-slate-300">+91 98765 43210</p>
              <div className="pt-2">
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                  ISO 9001:2015 Certified
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} ECON Building Centre. {t("rights_reserved")}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
