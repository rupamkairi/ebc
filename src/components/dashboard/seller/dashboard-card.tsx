import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtext?: string;
  iconComponent?: React.ReactNode;
  contentComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
}

export function DashboardCard({
  title,
  subtext,
  iconComponent,
  contentComponent,
  footerComponent,
  className,
  children,
  ...props
}: DashboardCardProps) {
  return (
    <Card
      className={cn("flex flex-col h-full overflow-hidden", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center">
        {iconComponent && <div>{iconComponent}</div>}
        <CardTitle>
          <TypographyH3 className="font-bold">{title}</TypographyH3>
          {subtext && (
            <TypographyMuted className="mb-2">{subtext}</TypographyMuted>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {contentComponent}
        {children}
      </CardContent>
      {footerComponent && <CardFooter>{footerComponent}</CardFooter>}
    </Card>
  );
}
