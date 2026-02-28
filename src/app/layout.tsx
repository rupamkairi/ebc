import type { Metadata } from "next";
import I18NProvider from "@/i18n/I18NProvider";
import QueryClientProvider from "@/queries/QueryClientProvider";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "E-CON Building Centre",
  description:
    "E-CON Precast System - Powered by Engineers. Trusted by Families.",
  icons: {
    icon: "/logo.svg",
  },
};

import { Toaster } from "@/components/ui/sonner";
import { SupportCenter } from "@/components/shared/support/support-center";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${openSans.variable} font-poppins antialiased`}
      >
        <QueryClientProvider>
          <I18NProvider>
            <>{children}</>
            <SupportCenter />
          </I18NProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
