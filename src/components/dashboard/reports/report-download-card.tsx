"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface ReportDownloadCardProps {
  title: string;
  description: string;
  onDownload: (start: Date, end: Date) => Promise<void | boolean>;
}

export function ReportDownloadCard({
  title,
  description,
  onDownload,
}: ReportDownloadCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      await onDownload(new Date(startDate), new Date(endDate));
    } catch (error) {
      console.error("Failed to download report", error);
      // Optional: Add toast notification mechanism here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card hover:bg-muted/10 transition-colors shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-card-foreground leading-none">
          {title}
        </h3>
        <p className="text-sm text-balance text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Start Date
            </label>
            <input
              title="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              End Date
            </label>
            <input
              title="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isLoading || !startDate || !endDate}
          className="w-full mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
