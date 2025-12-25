"use client";

// import { Navbar } from "@/components/shared/navbar";

export default function SellerDashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="min-h-screen bg-white-background">
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
      </main>
    </div>
  );
}
