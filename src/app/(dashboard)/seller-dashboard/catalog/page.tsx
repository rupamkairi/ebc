"use client";

import { 
  Plus, 
  Search, 
  MoreVertical, 
  Package, 
  MapPin, 
  Clock, 
  IndianRupee,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import { CreateListingModal } from "./create-listing-modal";
import { ItemListing } from "@/types/catalog";
import { toast } from "sonner";

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. Fetch User Entities
  const { data: entities, isLoading: isLoadingEntities, isError: isErrorEntities } = useEntitiesQuery();
  const sellerEntity = entities?.[0];

  // 2. Fetch Item Listings for this Entity
  const { data: listings, isLoading: isLoadingListings } = useItemListingsQuery({
    entityId: sellerEntity?.id,
    search: searchQuery
  });

  // 3. Filter listings based on type (PRODUCT/SERVICE)
  const filteredProducts = useMemo<ItemListing[]>(() => 
    listings?.filter(l => l.item?.type === "PRODUCT") || [], 
  [listings]);

  const filteredServices = useMemo<ItemListing[]>(() => 
    listings?.filter(l => l.item?.type === "SERVICE") || [], 
  [listings]);

  const isLoading = isLoadingEntities || isLoadingListings;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5 border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="space-y-2 relative z-10">
              <h1 className="text-4xl md:text-6xl font-black text-foreground italic tracking-tight">
                Store Catalog
              </h1>
              <p className="text-foreground/60 font-bold italic">
                {sellerEntity ? `Managing listings for ${sellerEntity.name}` : "Showcase your products and professional services to verified buyers."}
              </p>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <Button 
                onClick={() => {
                  if (isLoadingEntities) return;
                  if (!sellerEntity) {
                    toast.error("Business entity not found. Please complete your store setup.");
                    return;
                  }
                  setIsCreateModalOpen(true);
                }}
                disabled={isLoadingEntities}
                className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 flex items-center gap-2 text-lg group transition-all hover:scale-105 active:scale-95"
              >
                {isLoadingEntities ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                )}
                Create {activeTab === "products" ? "Product Listing" : "Service Offering"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="products" value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <TabsList className="bg-white border border-border p-1.5 rounded-2xl h-auto self-start shadow-sm flex overflow-hidden">
                <TabsTrigger value="products" className="rounded-xl px-10 py-3 font-black text-xs data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all uppercase tracking-widest border-none outline-none">
                  Products
                </TabsTrigger>
                <TabsTrigger value="services" className="rounded-xl px-10 py-3 font-black text-xs data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all uppercase tracking-widest border-none outline-none">
                  Services
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${activeTab === "products" ? "Products" : "Services"}...`} 
                  className="w-full bg-white border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold placeholder:text-foreground/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm focus:border-primary/20"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                  <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" size={32} />
                </div>
                <p className="font-black text-foreground/40 italic text-xl tracking-tight">Syncing with Store Cloud...</p>
              </div>
            ) : isErrorEntities ? (
              <div className="py-20 text-center bg-rose-50 border-2 border-dashed border-rose-200 rounded-[3rem] animate-in zoom-in-95 duration-500">
                 <AlertCircle className="mx-auto h-16 w-16 text-rose-500 mb-6" />
                 <p className="font-black text-rose-900 text-2xl italic tracking-tight">Failed to load business context.</p>
                 <p className="text-rose-600/60 font-bold mt-2">Please check your connection or login again.</p>
              </div>
            ) : !sellerEntity ? (
              <div className="py-32 text-center border-2 border-dashed border-border rounded-4xl bg-white/50 backdrop-blur-sm animate-in zoom-in-95 duration-500">
                 <div className="h-20 w-20 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-foreground/20">
                    <MapPin size={40} />
                 </div>
                 <p className="font-black text-foreground/30 text-2xl italic tracking-tight">No Business Entity found.</p>
                 <p className="text-foreground/20 font-bold mt-2 mb-8 uppercase tracking-widest text-xs">Setup your store to start listing items</p>
                 <Button className="bg-primary text-white font-black rounded-2xl h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Complete Setup</Button>
              </div>
            ) : (
              <>
                <TabsContent value="products" className="mt-0 space-y-4 outline-none">
                  <div className="grid gap-4">
                    {filteredProducts.length > 0 ? filteredProducts.map((listing) => (
                      <Card key={listing.id} className="border-none shadow-sm hover:shadow-2xl transition-all group overflow-hidden bg-white rounded-4xl">
                        <CardContent className="p-0">
                          <div className="flex items-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-muted/20 flex items-center justify-center text-foreground/10 shrink-0 group-hover:bg-primary/5 transition-colors">
                              <Package size={40} />
                            </div>
                            <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors italic tracking-tight">
                                    {listing.item?.name}
                                  </h3>
                                  <Badge className={`${listing.isActive ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-400 shadow-slate-200'} text-white border-none font-black text-[10px] px-3 py-1 shadow-lg`}>
                                    {listing.isActive ? "ACTIVE" : "INACTIVE"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                                  <span>{listing.item?.category?.name}</span>
                                  <div className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
                                  <span className="text-emerald-600/60">{listing.item?.brand?.name}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-10">
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Selling Rate</p>
                                  <div className="flex items-center justify-end font-black text-primary text-3xl md:text-4xl tracking-tighter italic">
                                    <IndianRupee size={24} className="mr-0.5" />
                                    {listing.item_rate?.rate}
                                    <span className="text-sm text-foreground/40 font-bold ml-1 not-italic">/ {listing.item_rate?.unitType}</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-foreground/20 hover:text-primary hover:bg-primary/5 transition-all">
                                  <MoreVertical size={24} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem] bg-white/5 backdrop-blur-sm">
                        <p className="font-black text-foreground/20 text-xl italic tracking-tight">No products listed in your catalog.</p>
                        <Button 
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-6 bg-primary text-white font-black rounded-2xl h-14 px-8 flex items-center gap-2 mx-auto shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                           <Plus size={24} /> Add First Product
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="services" className="mt-0 space-y-4 outline-none">
                  <div className="grid gap-4">
                    {filteredServices.length > 0 ? filteredServices.map((listing) => (
                      <Card key={listing.id} className="border-none shadow-sm hover:shadow-2xl transition-all group overflow-hidden bg-white rounded-4xl">
                        <CardContent className="p-0">
                          <div className="flex items-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-muted/20 flex items-center justify-center text-foreground/10 shrink-0 group-hover:bg-primary/5 transition-colors">
                              <Clock size={40} />
                            </div>
                            <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl md:text-2xl font-black group-hover:text-primary transition-colors italic text-blue-900 tracking-tight">
                                    {listing.item?.name}
                                  </h3>
                                  <Badge className={`${listing.isActive ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-400 shadow-slate-200'} text-white border-none font-black text-[10px] px-3 py-1 shadow-lg`}>
                                    {listing.isActive ? "ACTIVE" : "INACTIVE"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-foreground/50 uppercase tracking-widest italic bg-primary/5 w-fit px-3 py-1.5 rounded-xl border border-primary/10">
                                  <MapPin size={14} className="text-primary" />
                                  {listing.item_region?.[0]?.state || "Global"} {listing.item_region && listing.item_region.length > 1 ? `+${listing.item_region.length - 1} more` : ""}
                                </div>
                              </div>

                              <div className="flex items-center gap-10">
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Service Fee</p>
                                  <div className="flex items-center justify-end font-black text-blue-600 text-3xl md:text-4xl tracking-tighter italic">
                                    <IndianRupee size={24} className="mr-0.5" />
                                    {listing.item_rate?.rate}
                                    <span className="text-sm text-foreground/40 font-bold ml-1 not-italic">/ {listing.item_rate?.unitType}</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-foreground/20 hover:text-primary hover:bg-primary/5 transition-all">
                                  <MoreVertical size={24} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="py-24 text-center border-2 border-dashed border-border rounded-4xl bg-white/5 backdrop-blur-sm">
                        <p className="font-black text-foreground/20 text-xl italic tracking-tight">No professional services listed yet.</p>
                        <Button 
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-6 bg-primary text-white font-black rounded-2xl h-14 px-8 flex items-center gap-2 mx-auto shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                           <Plus size={24} /> Add First Service
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      <BottomNav />

      <CreateListingModal 
        key={isCreateModalOpen ? "open" : "closed"}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        entityId={sellerEntity?.id || ""}
        type={activeTab === "products" ? "PRODUCT" : "SERVICE"}
      />
    </div>
  );
}
