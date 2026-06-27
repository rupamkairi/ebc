import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function TermsAndConditionsPage() {
  return <LegalPage content={legalPages["terms-and-conditions"]} />;
}
