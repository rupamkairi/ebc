"use client";

import Link from "next/link";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportDefinition } from "./report-registry";

interface ReportNavigationGridProps {
  reports: ReportDefinition[];
  basePath: string;
}

export function ReportNavigationGrid({
  reports,
  basePath,
}: ReportNavigationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <Link
          key={`${report.roleScope}-${report.slug}`}
          href={`${basePath}/${report.slug}`}
          className="group h-full"
        >
          <Card className="h-full border-primary/10 transition-colors hover:border-primary/30 hover:bg-muted/30">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileSpreadsheet className="size-5" />
                </div>
                <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {report.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-sm font-medium text-primary">
                Open report
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
