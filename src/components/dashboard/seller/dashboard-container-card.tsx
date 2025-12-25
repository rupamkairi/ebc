import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardContainerCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardContainerCard({
  title,
  action,
  children,
  className,
  ...props
}: DashboardContainerCardProps) {
  return (
    <Card className={cn("w-full h-full flex flex-col", className)} {...props}>
      {(title || action) && (
        <CardHeader className="flex flex-row items-center">
          {title && <CardTitle>{title}</CardTitle>}
          {action && <div>{action}</div>}
        </CardHeader>
      )}
      <CardContent className="grow p-0">{children}</CardContent>
    </Card>
  );
}
