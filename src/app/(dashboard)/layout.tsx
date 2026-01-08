import { OnboardingProvider } from "@/components/auth/onboarding-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  );
}
