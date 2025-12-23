"use strict";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressBarProps {
  steps: { label: string; step: number }[];
  currentStep: number;
  className?: string;
  onStepClick?: (step: number) => void;
}

export function ProgressBar({
  steps,
  currentStep,
  className,
  onStepClick,
}: ProgressBarProps) {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="relative flex items-center justify-between w-full">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-muted -z-10 -translate-y-1/2 rounded-full" />

        {/* Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-2 bg-linear-to-r from-primary to-secondary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isActive = step.step <= currentStep;
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;

          return (
            <div
              key={step.step}
              className={cn(
                "flex flex-col items-center gap-2 cursor-pointer group",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={() =>
                onStepClick && step.step < currentStep && onStepClick(step.step)
              }
            >
              <div
                className={cn(
                  "relative flex items-center justify-center size-10 md:size-12 rounded-full border-4 transition-all duration-300 shadow-sm",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground scale-90"
                    : isCurrent
                    ? "bg-background border-primary text-primary shadow-lg scale-110 ring-4 ring-primary/20"
                    : "bg-background border-muted text-muted-foreground group-hover:border-primary/50"
                )}
              >
                {isCompleted ? (
                  <Check className="size-5 md:size-6 stroke-3" />
                ) : (
                  <span className="text-base md:text-lg font-black">
                    {step.step}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs md:text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors lg:absolute lg:top-full lg:mt-3",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
