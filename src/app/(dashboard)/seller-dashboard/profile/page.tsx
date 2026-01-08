"use client";

import { 
  User as UserIcon, 
  Store, 
  Camera, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuthStore } from "@/store/authStore";
import { useEntitiesQuery } from "@/queries/entityQueries";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: entities } = useEntitiesQuery();
  
  const entity = entities?.[0];
  const businessName = entity?.name || user?.name || "Member";
  const legalName = entity?.legalName || "Not Provided";

  return (
    <div className="flex flex-col gap-8">
      {/* Cover & Profile Header */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-linear-to-r from-primary/80 via-blue-600 to-indigo-700 rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-6 h-full border-white/20 border">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border-white/10 border" />
              ))}
            </div>
          </div>
          <button className="absolute bottom-6 right-8 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
            <Camera size={14} />
            Edit Cover
          </button>
        </div>
        <div className="px-8 -mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative group cursor-pointer">
              <div className="h-full w-full rounded-4xl bg-muted/30 flex items-center justify-center text-foreground/20 overflow-hidden relative">
                  <UserIcon size={64} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Camera size={24} />
                  </div>
              </div>
            </div>
            <div className="pb-4 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-foreground tracking-tight">{businessName}</h1>
                <CheckCircle2 className="text-primary fill-primary/10" size={24} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-foreground/40 italic">
                <span className="flex items-center gap-2 tracking-tight uppercase">
                  <Store size={14} className="text-primary" />
                  Digital Storefront Active
                </span>
                <span className="flex items-center gap-2 tracking-tight uppercase">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Verified Seller
                </span>
              </div>
            </div>
          </div>
          <div className="pb-4 flex gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-border font-bold bg-white">
              Preview Store
            </Button>
            <Button className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl shadow-lg shadow-secondary/10">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start gap-8 mb-8 overflow-x-auto no-scrollbar">
          <TabsTrigger value="basic" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 py-4 font-black text-xs uppercase tracking-[0.2em] text-foreground/40 data-[state=active]:text-primary transition-all shadow-none">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="business" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 py-4 font-black text-xs uppercase tracking-[0.2em] text-foreground/40 data-[state=active]:text-primary transition-all shadow-none">
            Business Details
          </TabsTrigger>
          <TabsTrigger value="compliance" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 py-4 font-black text-xs uppercase tracking-[0.2em] text-foreground/40 data-[state=active]:text-primary transition-all shadow-none">
            Compliance & KYC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-0 space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-black text-foreground italic">Contact Information</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Business Legal Name</label>
                    <input type="text" readOnly value={legalName} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-bold outline-none cursor-not-allowed opacity-70" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Email Address</label>
                    <input type="email" readOnly defaultValue={user?.email || "Not Provided"} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-bold outline-none cursor-not-allowed opacity-70" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Mobile Number</label>
                    <input type="tel" readOnly defaultValue={user?.phoneNumber || "Not Provided"} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-bold outline-none cursor-not-allowed opacity-70" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-black text-foreground italic">Store Links</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                      <input type="url" defaultValue="https://rk-enterprises.ebc.com" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 pl-10 font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-primary" />
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/5 border border-secondary/10 space-y-3">
                    <h4 className="font-black text-secondary uppercase tracking-tight text-xs">Share your storefront</h4>
                    <p className="text-xs font-medium text-foreground/40 leading-relaxed italic">Send your digital catalog to buyers on WhatsApp or Social Media to get direct inquiries.</p>
                    <Button variant="ghost" className="text-secondary font-black text-xs hover:bg-secondary/10 p-0 h-auto">
                      Copy unique link <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="mt-0">
            {/* Placeholder for business details */}
            <Card className="border-none shadow-sm p-12 text-center text-foreground/20">
              <Briefcase size={48} className="mx-auto mb-4" />
              <p className="font-bold italic">Business profile management tools coming soon.</p>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
