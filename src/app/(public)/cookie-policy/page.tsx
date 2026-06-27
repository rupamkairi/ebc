import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function CookiePolicyPage() {
  return <LegalPage content={legalPages["cookie-policy"]} />;
}
