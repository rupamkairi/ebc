"use client";

import Container from "@/components/ui/containers";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function FooterSection() {
  const { t } = useLanguage();
  return (
    <footer className="bg-linear-to-b from-primary to-primary/50 text-white pt-10 pb-6">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 mb-8 px-2">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-[28px] font-bold tracking-tight">
                {t("footer_brand")}
              </h2>
              <p className="text-[13px] font-medium text-white/90 leading-relaxed max-w-sm">
                {t("footer_tagline")}
              </p>
            </div>

            <ul className="space-y-2">
              {[
                t("footer_features_1"),
                t("footer_features_2"),
                t("footer_features_3"),
                t("footer_features_4"),
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-[13px] font-semibold"
                >
                  <span className="shrink-0 h-4 w-4 rounded-full border border-secondary flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="h-2.5 w-2.5 text-secondary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="inline-flex items-center gap-3 bg-white text-primary px-4 py-2 rounded-full shadow-sm">
              <div className="shrink-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-[18px] w-[18px] text-secondary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-[11px] md:text-[12px] font-medium">
                {t("footer_experience")}
              </span>
            </div>
          </div>

          {/* Marketplace Column */}
          <div className="lg:col-span-2 space-y-4 pt-1">
            <h4 className="text-[17px] font-semibold tracking-wide">
              {t("footer_marketplace")}
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-white/90">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_ai_calculator")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_compare_prices")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_request_quote")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_experts")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("conference_hall")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_find_sellers")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_find_workers")}
                </a>
              </li>
            </ul>
          </div>

          {/* For You Column */}
          <div className="lg:col-span-2 space-y-4 pt-1">
            <h4 className="text-[17px] font-semibold tracking-wide">
              {t("footer_for_you")}
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-white/90">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_how_ebc_helps")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_planning")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_cost_guide")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_faq_builders")}
                </a>
              </li>
            </ul>
          </div>

          {/* Helpful Links Column */}
          <div className="lg:col-span-2 space-y-4 pt-1">
            <h4 className="text-[17px] font-semibold tracking-wide">
              {t("footer_helpful_links")}
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-white/90">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_estimate_cost")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_talk_expert")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_cost_guide")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_compare_prices")}
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Company Column */}
          <div className="lg:col-span-2 space-y-4 pt-1">
            <h4 className="text-[17px] font-semibold tracking-wide">
              {t("footer_support_company")}
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-white/90">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_about")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_how_works")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_contact_support")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_help_faq")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("privacy_policy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_seller_agreement")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer_consumer_safety")}
                </a>
              </li>
              <li>
                <a
                  href="/auth/admin-login"
                  className="hover:text-white transition-colors"
                >
                  {t("footer_admin_login")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact & Social Row */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pb-6 px-2">
          {/* Contact Items */}
          <div className="flex flex-wrap justify-center xl:justify-start gap-5 md:gap-8">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <svg
                  className="h-[14px] w-[14px] text-secondary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="text-[10px] md:text-[11px] font-medium tracking-wide">
                {t("footer_location")}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <svg
                  className="h-[14px] w-[14px] text-secondary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="text-[10px] md:text-[11px] font-medium tracking-wide">
                +91 1234567890
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <svg
                  className="h-[14px] w-[14px] text-secondary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="text-[10px] md:text-[11px] font-medium tracking-wide">
                {t("footer_email")}
              </span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="bg-white p-1.5 md:p-2 rounded-full hover:bg-white/90 transition-all shadow-sm"
            >
              <svg
                className="h-[14px] w-[14px] md:h-4 md:w-4 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="#"
              className="bg-white p-1.5 md:p-2 rounded-full hover:bg-white/90 transition-all shadow-sm"
            >
              <svg
                className="h-[14px] w-[14px] md:h-4 md:w-4 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="bg-white p-1.5 md:p-2 rounded-full hover:bg-white/90 transition-all shadow-sm"
            >
              <svg
                className="h-[14px] w-[14px] md:h-4 md:w-4 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="pb-5 px-2 max-w-4xl mx-auto">
          <p className="text-center text-[11px] md:text-[13px] font-medium text-white/90">
            {t("footer_disclaimer")}
          </p>
        </div>

        {/* Bottom Meta Row */}
        <div className="pt-5 border-t border-white/20 px-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] md:text-[13px] font-medium text-white/90">
            <div className="space-y-1 text-center md:text-left">
              <p>{t("footer_copyright")}</p>
              <p>{t("footer_serving")}</p>
            </div>
            <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
              <LanguageSwitcher variant="footer" />
              <p>{t("footer_designed_by")}</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
