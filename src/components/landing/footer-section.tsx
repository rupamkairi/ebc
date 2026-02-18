"use client";

import Container from "@/components/containers/containers";

export function FooterSection() {
  return (
    <footer className="bg-[#3B5998] text-white pt-20 pb-10">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-16 px-4">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Econ Building Centre</h2>
              <p className="text-sm font-medium text-white/80 leading-relaxed max-w-sm">
                India&apos;s structured construction marketplace for smart home building.
              </p>
            </div>
            
            <ul className="space-y-3">
              {[
                "Verified Sellers & Service Providers",
                "Transparent Pricing & RFQs",
                "AI-Powered Cost Intelligence",
                "Engineer-Guided Decisions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="shrink-0 h-5 w-5 rounded-full border border-[#FFA500] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5 text-[#FFA500]">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="inline-flex items-center gap-3 bg-white text-[#3B5998] px-5 py-2.5 rounded-full shadow-sm">
              <div className="shrink-0 h-5 w-5 rounded-full border border-[#FFA500] flex items-center justify-center">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5 text-[#FFA500]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[11px] font-bold">Built on real construction experience since 2004.</span>
            </div>
          </div>

          {/* Marketplace Column */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-bold">Marketplace</h4>
            <ul className="space-y-3 text-sm font-medium text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">AI Cost Calculator (Free)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compare Material Prices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Request Quotation (RFQ)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Engage with Experts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conference Hall</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Verified Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Skilled Workers</a></li>
            </ul>
          </div>

          {/* For You Column */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-bold">For You</h4>
            <ul className="space-y-3 text-sm font-medium text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">How EBC Helps Families</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Planning Your Dream Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cost Estimation Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs for Home Builders</a></li>
            </ul>
          </div>

          {/* Helpful Links Column */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-bold">Helpful Links</h4>
            <ul className="space-y-3 text-sm font-medium text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Estimate Cost (Free)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Talk to an Expert</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cost Estimation Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compare Prices</a></li>
            </ul>
          </div>

          {/* Support & Company Column */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-bold">Support & Company</h4>
            <ul className="space-y-3 text-sm font-medium text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">About ECON / EBC</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How EBC Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help & FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seller Agreement</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consumer Safety Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-b border-white/10">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <svg className="h-4 w-4 text-[#3B5998]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="text-[11px] font-bold">Location xyz , Kolkata</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <svg className="h-4 w-4 text-[#3B5998]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold">+91 1234567890</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <svg className="h-4 w-4 text-[#3B5998]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="text-[11px] font-bold">xyz123.business@gmail.com</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="bg-white p-2.5 rounded-full hover:bg-white/90 transition-all">
              <svg className="h-5 w-5 text-[#3B5998]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="bg-white p-2.5 rounded-full hover:bg-white/90 transition-all">
              <svg className="h-5 w-5 text-[#3B5998]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="bg-white p-2.5 rounded-full hover:bg-white/90 transition-all">
              <svg className="h-5 w-5 text-[#3B5998]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Meta Row */}
        <div className="mt-10 space-y-8">
          <p className="text-center text-[10px] md:text-sm font-medium text-white/60">
            ECON Building Centre (EBC) is a technology-enabled marketplace facilitating connections between buyers and sellers.
          </p>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs font-semibold text-white/50">
            <div className="space-y-1 text-center md:text-left">
              <p>© 2026 ECON Building Centre. All rights reserved.</p>
              <p>Made in India • Serving Tier-2 & Tier-3 India</p>
            </div>
            <div className="text-center md:text-right">
              <p>Designed By : Pink Shadow Media & Entertainment Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
