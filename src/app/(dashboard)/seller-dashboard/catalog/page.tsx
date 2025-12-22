"use client";

import { 
  Plus, 
  Search, 
  Package, 
  Settings2,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  MapPin,
  Clock,
  IndianRupee,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const products = [
  { id: 1, name: "Premium Cement", brand: "Ultratech", rate: "450", unit: "Bag", status: "Active", stock: "In Stock" },
  { id: 2, name: "Standard Bricks", brand: "Local", rate: "8", unit: "Piece", status: "Active", stock: "In Stock" },
  { id: 3, name: "Steel Sariya (12mm)", brand: "TATA Tiscon", rate: "65,000", unit: "Ton", status: "Active", stock: "Limited" },
];

const services = [
  { id: 1, name: "Plumbing Service", areas: "Indore (All), Ujjain", rate: "500", unit: "Hour", status: "Active" },
  { id: 2, name: "Electrical Fitting", areas: "Indore", rate: "800", unit: "Project", status: "Inactive" },
];

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                My Catalog
              </h1>
              <p className="text-foreground/60 font-medium">
                Manage your product listings and service offerings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-12 px-5 border-border font-bold">
                <Settings2 size={18} className="mr-2" />
                Settings
              </Button>
              <Button className="rounded-2xl h-12 px-6 bg-secondary hover:bg-secondary/90 text-white font-black shadow-lg shadow-secondary/20 flex items-center gap-2">
                <Plus size={20} />
                Add New {activeTab === "products" ? "Product" : "Service"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto self-start">
                <TabsTrigger value="products" className="rounded-xl px-8 py-2.5 font-black text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all uppercase tracking-wider">
                  Products
                </TabsTrigger>
                <TabsTrigger value="services" className="rounded-xl px-8 py-2.5 font-black text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all uppercase tracking-wider">
                  Services
                </TabsTrigger>
              </TabsList>

              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  className="w-full bg-white border border-border rounded-2xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <TabsContent value="products" className="mt-0 space-y-4">
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-muted/30 flex items-center justify-center text-foreground/20 shrink-0">
                          <Package size={32} />
                        </div>
                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                {product.status}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-foreground/40 uppercase tracking-tight">
                              {product.brand} • {product.stock}
                            </p>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Base Rate</p>
                              <div className="flex items-center justify-end font-black text-primary text-xl">
                                <IndianRupee size={16} />
                                {product.rate}
                                <span className="text-xs text-foreground/40 font-bold ml-1">/ {product.unit}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full text-foreground/40 hover:text-primary">
                              <MoreVertical size={20} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-0 space-y-4">
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-muted/30 flex items-center justify-center text-foreground/20 shrink-0">
                          <Clock size={32} />
                        </div>
                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                                {service.name}
                              </h3>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${
                                service.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                <CheckCircle2 size={10} />
                                {service.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-foreground/40 uppercase tracking-tight">
                              <MapPin size={14} className="text-primary/60" />
                              {service.areas}
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Hourly Rate</p>
                              <div className="flex items-center justify-end font-black text-primary text-xl">
                                <IndianRupee size={16} />
                                {service.rate}
                                <span className="text-xs text-foreground/40 font-bold ml-1">/ {service.unit}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full text-foreground/40 hover:text-primary">
                              <MoreVertical size={20} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
