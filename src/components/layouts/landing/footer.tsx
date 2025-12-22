"use client";

import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">EBC</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by Engineers. Trusted by Families. Made in India • Built for ALL.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#">Materials</Link></li>
              <li><Link href="#">Services</Link></li>
              <li><Link href="#">Engineer Support</Link></li>
              <li><Link href="#">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Info</h4>
            <p className="text-sm text-slate-400 mb-2">info@ebc.com</p>
            <p className="text-sm text-slate-400">+91 98765 43210</p>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ECON Building Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
