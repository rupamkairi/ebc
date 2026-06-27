import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function FaqPage() {
  return <LegalPage content={legalPages.faq} />;
}
