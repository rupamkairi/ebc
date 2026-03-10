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
import { ITEM_TYPE } from "@/constants/enums";
import { isServiceBusiness, isProductBusiness } from "@/constants/roles";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuthStore } from "@/store/authStore";
export default function CatalogPage() {
  const { t } = useLanguage();
  const { user: authUser } = useAuthStore();
  
  const isService = isServiceBusiness(authUser?.role);
  const isProduct = isProductBusiness(authUser?.role);

  const {
    data: entities,
    isLoading: isLoadingEntities,
    isError: isErrorEntities,
  } = useEntitiesQuery();
  const sellerEntity = entities?.[0];

  const [activeTab, setActiveTab] = useState(
    isService ? "services" : "products",
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: listings, isLoading: isLoadingListings } = useItemListingsQuery(
    {
      entityId: sellerEntity?.id || "",
    },
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
    <div className="space-y-10">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CatalogHeader
          isLoading={isLoadingEntities}
          isServiceBusiness={isService}
          businessName={sellerEntity?.name}
          verificationStatus={sellerEntity?.verificationStatus}
          onCreateClick={() => {
            if (!sellerEntity || sellerEntity.verificationStatus !== "APPROVED") {
              toast.error(
                !sellerEntity 
                  ? t("business_entity_not_found")
                  : `Your business must be APPROVED to create listings. Current status: ${sellerEntity.verificationStatus}`
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
            isServiceBusiness={isService}
            isProductBusiness={isProduct}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {isLoading ? (
            <LoadingState />
          ) : isErrorEntities ? (
            <ErrorState
              title={t("failed_load_business_context")}
              description={t("check_connection_login_again")}
            />
          ) : !sellerEntity ? (
            <NoEntityState
              onSetupClick={() =>
                toast.info("Redirection to setup coming soon...")
              }
            />
          ) : (
            <>
              {!isService && (
                <TabsContent
                  value="products"
                  className="mt-0 space-y-4 outline-none"
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "grid gap-4"
                    }
                  >
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
                        onAddClick={() => {
                          if (sellerEntity?.verificationStatus !== "APPROVED") {
                            toast.error(`Your business must be APPROVED to create listings. Current status: ${sellerEntity?.verificationStatus}`);
                            return;
                          }
                          setIsCreateModalOpen(true);
                        }}
                        disabled={sellerEntity?.verificationStatus !== "APPROVED"}
                      />
                    )}
                  </div>
                </TabsContent>
              )}

              {isService && (
                <TabsContent
                  value="services"
                  className="mt-0 space-y-4 outline-none"
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "grid gap-4"
                    }
                  >
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
                        onAddClick={() => {
                          if (sellerEntity?.verificationStatus !== "APPROVED") {
                            toast.error(`Your business must be APPROVED to create listings. Current status: ${sellerEntity?.verificationStatus}`);
                            return;
                          }
                          setIsCreateModalOpen(true);
                        }}
                        disabled={sellerEntity?.verificationStatus !== "APPROVED"}
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
        itemType={isService ? ITEM_TYPE.SERVICE : ITEM_TYPE.PRODUCT}
      />
    </div>
  );
}
