import type { Metadata } from "next";
import I18NProvider from "@/i18n/I18NProvider";
import QueryClientProvider from "@/queries/QueryClientProvider";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const sansFont = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "E-CON Building Centre",
  description: "E-CON Precast System - Powered by Engineers. Trusted by Families.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} antialiased`}>
        <QueryClientProvider>
          <I18NProvider>
            <>{children}</>
          </I18NProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
