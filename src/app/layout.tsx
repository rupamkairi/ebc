import I18NProvider from "@/i18n/I18NProvider";
import QueryClientProvider from "@/queries/QueryClientProvider";
import { Open_Sans } from "next/font/google";
import "./globals.css";

// Define Metadata type for Next.js
type Metadata = {
  title: string;
  description: string;
};

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
