import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add props if needed in future
}

export function NotificationCard({
  className,
  ...props
}: NotificationCardProps) {
  return (
    <Card className={cn("h-full flex flex-col", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[200px] md:h-full px-6 pb-6">
          <div className="flex flex-col gap-4">
            {/* Placeholder notifications */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 border-b pb-2 last:border-0"
              >
                <span className="text-sm font-medium">New Order Received</span>
                <span className="text-xs text-muted-foreground">
                  Order #1234{i} needs processing.
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
