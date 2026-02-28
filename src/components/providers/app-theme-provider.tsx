"use client";

import * as React from "react";

export type AppThemeVariant = "default" | "app";

interface AppThemeContextProps {
  variant: AppThemeVariant;
}

const AppThemeContext = React.createContext<AppThemeContextProps>({
  variant: "default",
});

export const useAppTheme = () => React.useContext(AppThemeContext);

export function AppThemeProvider({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: AppThemeVariant;
}) {
  return (
    <AppThemeContext.Provider value={{ variant }}>
      {children}
    </AppThemeContext.Provider>
  );
}
