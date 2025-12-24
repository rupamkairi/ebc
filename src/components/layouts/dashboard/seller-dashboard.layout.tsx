"use client";

export default function SellerDashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>header</header>
      <div>{children}</div>
      <footer>footer</footer>
    </div>
  );
}
