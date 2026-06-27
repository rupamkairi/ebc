import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function PrivacyPolicyPage() {
  return <LegalPage content={legalPages["privacy-policy"]} />;
}
