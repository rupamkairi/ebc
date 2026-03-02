"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import { CreateListingModal } from "./create-listing-modal";
import { CatalogHeader } from "@/components/dashboard/seller/catalog/catalog-header";
import { CatalogToolbar } from "@/components/dashboard/seller/catalog/catalog-toolbar";
import { ListingCard } from "@/components/dashboard/seller/catalog/listing-card";
import {
  LoadingState,
  ErrorState,
  NoEntityState,
  EmptyCatalogState,
} from "@/components/dashboard/seller/catalog/catalog-empty-states";
import { ENTITY_TYPE, ITEM_TYPE, ACTIVITY_TYPE } from "@/constants/enums";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { Bell } from "lucide-react";
import { useAssignmentsQuery } from "@/queries/activityQueries";

export default function CatalogPage() {
  const {
    data: entities,
    isLoading: isLoadingEntities,
    isError: isErrorEntities,
  } = useEntitiesQuery();
  const sellerEntity = entities?.[0];

  const isServiceBusiness = sellerEntity?.type === ENTITY_TYPE.SERVICE_PROVIDER;
  const isProductBusiness =
    sellerEntity?.type === ENTITY_TYPE.MANUFACTURER ||
    sellerEntity?.type === ENTITY_TYPE.WHOLESALER ||
    sellerEntity?.type === ENTITY_TYPE.RETAILER;

  const [activeTab, setActiveTab] = useState(isServiceBusiness ? "services" : "products");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: listings, isLoading: isLoadingListings } = useItemListingsQuery(
    {
      entityId: sellerEntity?.id || "",
    },
  );

  const { data: enquiryAssignments = [] } = useAssignmentsQuery({
    toEntityId: sellerEntity?.id,
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });
  const respondedEnquiryIds = new Set(
    enquiryAssignments
      .filter((a) => a.enquiry?.status && a.enquiry.status !== "PENDING")
      .map((a) => a.enquiry!.id),
  );

  const isLoading = isLoadingEntities || isLoadingListings;

  const filteredProducts = (listings || [])
    .filter((l) => l.item?.type === ITEM_TYPE.PRODUCT)
    .filter(
      (l) =>
        l.item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.item?.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const filteredServices = (listings || [])
    .filter((l) => l.item?.type === ITEM_TYPE.SERVICE)
    .filter((l) =>
      l.item?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-10">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CatalogHeader
          isLoading={isLoadingEntities}
          isServiceBusiness={isServiceBusiness}
          businessName={sellerEntity?.name}
          onCreateClick={() => {
            if (isLoadingEntities) return;
            if (!sellerEntity) {
              toast.error(
                "Business entity not found. Please complete your store setup.",
              );
              return;
            }
            setIsCreateModalOpen(true);
          }}
        />

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <CatalogToolbar
            activeTab={activeTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isServiceBusiness={isServiceBusiness}
            isProductBusiness={isProductBusiness}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {isLoading ? (
            <LoadingState />
          ) : isErrorEntities ? (
            <ErrorState
              title="Failed to load business context."
              description="Please check your connection or login again."
            />
          ) : !sellerEntity ? (
            <NoEntityState
              onSetupClick={() =>
                toast.info("Redirection to setup coming soon...")
              }
            />
          ) : (
            <>
              {!isServiceBusiness && (
                <TabsContent
                  value="products"
                  className="mt-0 space-y-4 outline-none"
                >
                  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          type={ITEM_TYPE.PRODUCT}
                          view={viewMode}
                        />
                      ))
                    ) : (
                      <EmptyCatalogState
                        type="products"
                        onAddClick={() => setIsCreateModalOpen(true)}
                      />
                    )}
                  </div>
                </TabsContent>
              )}

              {isServiceBusiness && (
                <TabsContent
                  value="services"
                  className="mt-0 space-y-4 outline-none"
                >
                  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          type={ITEM_TYPE.SERVICE}
                          view={viewMode}
                        />
                      ))
                    ) : (
                      <EmptyCatalogState
                        type="services"
                        onAddClick={() => setIsCreateModalOpen(true)}
                      />
                    )}
                  </div>
                </TabsContent>
              )}
            </>
          )}
        </Tabs>
      </div>

      <CreateListingModal
        key={isCreateModalOpen ? "open" : "closed"}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        entityId={sellerEntity?.id || ""}
        itemType={isServiceBusiness ? ITEM_TYPE.SERVICE : ITEM_TYPE.PRODUCT}
      />
      </div>

      {/* Notification Sidebar */}
      <div className="space-y-8 h-full">
        <div className="sticky top-24 pt-4 lg:pt-0">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Bell className="h-5 w-5 text-[#173072]" />
            <h2 className="text-xl font-bold text-[#173072] tracking-tight">Notifications</h2>
          </div>
          <NotificationInbox userType="SELLER" respondedEnquiryIds={respondedEnquiryIds} />
        </div>
      </div>
    </div>
  );
}
