import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function HowEbcWorksPage() {
  return <LegalPage content={legalPages["how-ebc-works"]} />;
}
