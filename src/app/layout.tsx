// // src/app/layout.tsx
// "use client";

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";

// // fonts
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// // optional metadata
// export const metadata: Metadata = {
//   title: "EBC Marketplace",
//   description: "EBC - B2B Marketplace Login System",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [queryClient] = useState(() => new QueryClient());

//   return (
//     <html lang="bn">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <QueryClientProvider client={queryClient}>
//           {children}
//         </QueryClientProvider>
//       </body>
//     </html>
//   );
// }

// src/app/layout.tsx
"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="bn">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
