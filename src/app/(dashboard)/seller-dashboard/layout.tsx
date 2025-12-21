"use client";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Seller Layout</h1>
      {children}
    </div>
  );
}
