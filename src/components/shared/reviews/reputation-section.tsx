"use client";

import { ReviewList } from "./review-list";
import { ReviewForm } from "./review-form";
import { ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReputationSectionProps {
  entityId: string;
  entityName?: string;
  enquiryId?: string;
  appointmentId?: string;
  className?: string;
}

export function ReputationSection({ entityId, entityName, enquiryId, appointmentId, className }: ReputationSectionProps) {
  // We just render the list and form, they handle their own data
  return (
    <div className={cn("space-y-10", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            Verified Trust Profile
          </div>
          <h2 className="text-3xl font-black tracking-tighter">
            {entityName ? `Reputation of ${entityName}` : "Reputation & Reviews"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            Real feedback from businesses like yours. We verify every transaction to ensure the highest quality of service and material standards.
          </p>
        </div>

        <ReviewForm 
          entityId={entityId} 
          enquiryId={enquiryId}
          appointmentId={appointmentId}
          trigger={
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              <Award className="h-4 w-4" />
              RATE YOUR EXPERIENCE
            </button>
          }
        />
      </div>

      <ReviewList entityId={entityId} />
    </div>
  );
}
