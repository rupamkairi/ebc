import { Card, CardContent } from "@/components/ui/card";
import { TypographyLarge } from "@/components/ui/typography";
import React from "react";

interface DisplayCard2Props {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

export function DisplayCard2({ icon, title, items }: DisplayCard2Props) {
  return (
    <Card className="shadow-lg border-none rounded-3xl h-full">
      <CardContent className="flex flex-col items-center text-center p-6 sm:p-8">
        <div className="mb-4">{icon}</div>
        <TypographyLarge className="font-bold mb-4">{title}</TypographyLarge>
        <ul className="text-sm text-muted-foreground space-y-2 w-full">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-left justify-center sm:justify-start"
            >
              <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0 hidden sm:block" />
              {/* Center alignment on mobile often looks better without bullet or with bullet inline. 
                 The original had flex items-start and text-left, but parent text-center.
                 Let's stick to the original design but ensure it looks good.
              */}
              <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
