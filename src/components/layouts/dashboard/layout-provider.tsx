import { SidebarProvider } from "../../ui/sidebar";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
