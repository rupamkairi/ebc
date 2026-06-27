import { PublicShell } from "@/components/shared/public-shell";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <PublicShell>{children}</PublicShell>
    </Suspense>
  );
}
