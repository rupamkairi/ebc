import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "./queries/QueryClientProvider";

// const sans = Open_Sans({
//   weight: ["400", "500", "600", "700", "800"],
//   style: ["normal", "italic"],
//   variable: "--font-open-sans",
//   subsets: ["latin"],
//   display: "swap",
// });
const sansFont = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "EBC Marketplace",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={`${sansFont.variable} antialiased`}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
