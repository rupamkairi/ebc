import { I18nProvider } from "@/components/providers/I18nProvider";
import QueryClientProvider from "@/queries/QueryClientProvider";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
// const poppins = Rubik({
//   variable: "--font-poppins",
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   // weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

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

import { SupportCenter } from "@/components/shared/support/support-center";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${openSans.variable} font-poppins antialiased`}
        suppressHydrationWarning
      >
        <QueryClientProvider>
          <I18nProvider>
            <>{children}</>
            <SupportCenter />
          </I18nProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
