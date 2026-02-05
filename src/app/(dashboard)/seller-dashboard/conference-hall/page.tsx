import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConferenceHallPage() {
  const router = useRouter();

  const sections = [
    {
      title: "Events",
      description: "Manage webinars, seminars, and recorded sessions.",
      href: "/seller-dashboard/conference-hall/events",
    },
    {
      title: "Offers",
      description: "Create and manage promotional offers for buyers.",
      href: "/seller-dashboard/conference-hall/offers",
    },
    {
      title: "Content",
      description: "Upload whitepapers, documents, and media resources.",
      href: "/seller-dashboard/conference-hall/content",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conference Hall</h1>
        <p className="text-muted-foreground">
          Manage your events, offers, and content for the community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => router.push(section.href)}
          >
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
