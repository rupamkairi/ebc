import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function RefundPolicyPage() {
  return <LegalPage content={legalPages["refund-policy"]} />;
}
