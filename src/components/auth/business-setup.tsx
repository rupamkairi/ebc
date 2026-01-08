"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Building2, Loader2, CheckCircle2 } from "lucide-react";
import { useCreateEntityMutation } from "@/queries/entityQueries";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BusinessSetup({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    description: "",
    op_type_label: user?.role?.includes("SERVICE") ? "Service Provider" : "Product Seller",
  });

  const createEntityMutation = useCreateEntityMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Business name is required");
      return;
    }

    // Map labels back to backend enums
    const op_type = formData.op_type_label === "Service Provider" ? "SERVICE" : "PRODUCT";

    try {
      await createEntityMutation.mutateAsync({
        name: formData.name,
        legalName: formData.legalName,
        description: formData.description,
        op_type,
      });
      toast.success("Business profile created!");
      onComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create business profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="container max-w-2xl px-4 py-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em] italic mb-4">
            Phase Two
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter italic">
            CREATE YOUR <span className="text-secondary">IDENTITY</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto italic">
            Set up your business profile to start {formData.op_type_label === "Service Provider" ? "offering services" : "listing products"}.
          </p>
        </div>

        <Card className="border-2 shadow-2xl bg-white/50 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Building2 size={24} />
              </div>
              <CardTitle className="text-xl font-black tracking-tight italic">Business Details</CardTitle>
            </div>
            <CardDescription className="font-medium italic">
              This information will be visible to potential buyers and partners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Business Type</FieldLabel>
                  <Select 
                    value={formData.op_type_label} 
                    onValueChange={(val) => setFormData({ ...formData, op_type_label: val })}
                  >
                    <SelectTrigger className="h-12 rounded-xl border border-border bg-white font-black text-xs uppercase tracking-widest text-secondary italic">
                      <SelectValue placeholder="Select path" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="Product Seller" className="font-bold italic">Product Seller</SelectItem>
                      <SelectItem value="Service Provider" className="font-bold italic">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Display Name</FieldLabel>
                  <Input 
                    placeholder="e.g. Skyline Constructions" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-xl border-border bg-white font-bold px-4"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Legal entity Name (Optional)</FieldLabel>
                  <Input 
                    placeholder="e.g. Skyline Private Limited" 
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="h-12 rounded-xl border-border bg-white font-bold px-4"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Business Description</FieldLabel>
                  <Textarea 
                    placeholder="Tell us about what you do..." 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[120px] rounded-xl border-border bg-white font-bold p-4 resize-none"
                  />
                </Field>
              </FieldGroup>

              <div className="pt-4 space-y-4">
                <Button 
                  type="submit" 
                  disabled={createEntityMutation.isPending}
                  className="w-full h-14 rounded-2xl bg-secondary text-white hover:bg-secondary/90 transition-all duration-300 font-black text-xs uppercase tracking-widest group shadow-lg shadow-secondary/20"
                >
                  {createEntityMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle2 className="ml-2" size={16} />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-[10px] font-bold text-muted-foreground/50 italic px-8 leading-relaxed">
                  By completing setup, you agree to our terms of service for {user?.role?.includes("SERVICE") ? "service providers" : "material sellers"}.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
