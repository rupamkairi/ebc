import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function AboutUsPage() {
  return <LegalPage content={legalPages["about-us"]} />;
}
