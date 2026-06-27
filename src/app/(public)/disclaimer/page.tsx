import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function DisclaimerPage() {
  return <LegalPage content={legalPages.disclaimer} />;
}
