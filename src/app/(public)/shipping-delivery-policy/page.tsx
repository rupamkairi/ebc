import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/components/legal/legal-content";

export default function ShippingDeliveryPolicyPage() {
  return <LegalPage content={legalPages["shipping-delivery-policy"]} />;
}
