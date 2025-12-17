"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/queries/get-query-client";
import type * as React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  /* Manual hydration removed - handled by Zustand persist middleware */

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
