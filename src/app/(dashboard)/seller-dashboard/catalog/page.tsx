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
import { useSessionQuery } from "@/queries/authQueries";
export default function CatalogPage() {
  const { t } = useLanguage();
  const { data: user } = useSessionQuery(); // Added this line
  const {
    data: entities,
    isLoading: isLoadingEntities, // Kept original name for consistency with other usages
    isError: isErrorEntities,
  } = useEntitiesQuery();
  const sellerEntity = entities?.[0];

  const isService = isServiceBusiness(user?.user?.role); // Modified
  const isProduct = isProductBusiness(user?.user?.role); // Modified

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
          onCreateClick={() => {
            if (isLoadingEntities) return;
            if (!sellerEntity) {
              toast.error(t("business_entity_not_found"));
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
                        onAddClick={() => setIsCreateModalOpen(true)}
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
        itemType={isService ? ITEM_TYPE.SERVICE : ITEM_TYPE.PRODUCT}
      />
    </div>
  );
}
