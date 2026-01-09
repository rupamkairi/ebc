"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight, Loader2 } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function RoleSelection() {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleRoleSelection = async (
    role: "USER_PRODUCT_SELLER_ADMIN" | "USER_SERVICE_PROVIDER_ADMIN"
  ) => {
    setIsLoading(role);
    try {
      await authService.updateProfile({ role });

      // Fetch fresh session to update local state
      const { user } = await authService.getSession();
      setUser(user);

      toast.success("Role updated successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update role";
      toast.error(errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="container max-w-4xl px-4 py-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] italic mb-4">
            Getting Started
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter italic">
            CHOOSE YOUR <span className="text-primary">PATH</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto italic">
            Tell us about your business so we can tailor the dashboard
            experience for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Seller Option */}
          <Card
            className={cn(
              "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10",
              isLoading === "USER_PRODUCT_SELLER_ADMIN"
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50"
            )}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Package size={160} />
            </div>
            <CardHeader className="space-y-4 pb-0">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <Package size={32} />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black tracking-tight italic">
                  Product Seller
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  I want to list and sell physical construction materials and
                  products.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <ul className="space-y-3 mb-8">
                {[
                  "Inventory Management",
                  "Direct Product Inquiries",
                  "Bulk Listing Tools",
                  "Verified Seller Badge",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm font-bold text-foreground/70 italic"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleRoleSelection("USER_PRODUCT_SELLER_ADMIN")}
                disabled={!!isLoading}
                className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest group/btn"
              >
                {isLoading === "USER_PRODUCT_SELLER_ADMIN" ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    Select Product Path
                    <ArrowRight
                      className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                      size={16}
                    />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Service Provider Option */}
          <Card
            className={cn(
              "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10",
              isLoading === "USER_SERVICE_PROVIDER_ADMIN"
                ? "border-secondary ring-2 ring-secondary/20"
                : "hover:border-secondary/50"
            )}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Truck size={160} />
            </div>
            <CardHeader className="space-y-4 pb-0">
              <div className="h-16 w-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                <Truck size={32} />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black tracking-tight italic">
                  Service Provider
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  I want to offer specialized construction services or
                  logistics.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <ul className="space-y-3 mb-8">
                {[
                  "Service Area Management",
                  "Appointment Scheduling",
                  "Portfolio Highlights",
                  "Customer Reviews",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm font-bold text-foreground/70 italic"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handleRoleSelection("USER_SERVICE_PROVIDER_ADMIN")
                }
                disabled={!!isLoading}
                className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-secondary hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest group/btn"
              >
                {isLoading === "USER_SERVICE_PROVIDER_ADMIN" ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    Select Service Path
                    <ArrowRight
                      className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                      size={16}
                    />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
            Secure Onboarding Powered by E-CON Systems
          </p>
        </div>
      </div>
    </div>
  );
}
