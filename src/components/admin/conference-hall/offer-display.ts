import { Offer, OfferRelation, OfferRegion } from "@/types/conference-hall";

export function normalizeOfferForAdmin(offer: Offer | null | undefined) {
  if (!offer) {
    return {
      details: undefined,
      targetRegions: [] as OfferRegion[],
      offerRelations: [] as OfferRelation[],
    };
  }

  const details = offer.offerDetails?.[0];
  const targetRegions =
    Array.isArray(offer.targetRegions) && offer.targetRegions.length > 0
      ? offer.targetRegions
      : Array.isArray(offer.targetRegion)
        ? offer.targetRegion
        : [];

  const offerRelations = Array.isArray(offer.offerRelations)
    ? offer.offerRelations.map(normalizeRelation)
    : [];

  return {
    details,
    targetRegions,
    offerRelations,
  };
}

function normalizeRelation(relation: OfferRelation): OfferRelation {
  const relationType =
    relation.relationType ||
    (relation.categoryId
      ? "CATEGORY"
      : relation.brandId
        ? "BRAND"
        : relation.specificationId
          ? "SPECIFICATION"
          : relation.itemId
            ? "ITEM"
            : relation.itemListingId
              ? "ITEM_LISTING"
              : relation.relationType);

  const relationId =
    relation.relationId ||
    relation.categoryId ||
    relation.brandId ||
    relation.specificationId ||
    relation.itemId ||
    relation.itemListingId ||
    "";

  return {
    ...relation,
    relationType: relationType as OfferRelation["relationType"],
    relationId,
  };
}
