import {
  ConferenceHallEvent,
  Content,
  Offer,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";

type ActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";
type VisibilityFilter = "ALL" | "PUBLIC" | "PRIVATE";
type EventModeFilter = "ALL" | "REMOTE" | "PHYSICAL" | "HYBRID";
type EventTypeFilter = "ALL" | ConferenceHallEvent["type"];

interface BaseConferenceHallFilters {
  verificationStatus?: string;
  activeState?: ActiveFilter;
  visibilityState?: VisibilityFilter;
}

interface EventFilters extends BaseConferenceHallFilters {
  eventType?: EventTypeFilter;
  eventMode?: EventModeFilter;
}

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getVerificationStatus = (status?: VERIFICATION_STATUS) =>
  status || VERIFICATION_STATUS.PENDING;

const matchesVerificationStatus = (
  status: VERIFICATION_STATUS | undefined,
  filter?: string,
) =>
  !filter || filter === "ALL" || getVerificationStatus(status) === filter;

const matchesActiveState = (isActive: boolean, filter?: ActiveFilter) =>
  !filter ||
  filter === "ALL" ||
  (filter === "ACTIVE" ? isActive : !isActive);

const matchesVisibilityState = (isPublic: boolean, filter?: VisibilityFilter) =>
  !filter ||
  filter === "ALL" ||
  (filter === "PUBLIC" ? isPublic : !isPublic);

const regionText = (regions?: { pincode?: unknown }[]) =>
  regions
    ?.map((region) => {
      const pincode = region.pincode as
        | { pincode?: string | null; district?: string | null; state?: string | null }
        | undefined;

      return [pincode?.pincode, pincode?.district, pincode?.state]
        .map(normalize)
        .join(" ");
    })
    .join(" ") || "";

export function filterConferenceHallEvents(
  events: ConferenceHallEvent[],
  search: string,
  filters: EventFilters = {},
) {
  const searchTerm = normalize(search);

  return events.filter((event) => {
    if (
      !matchesVerificationStatus(
        event.verificationStatus,
        filters.verificationStatus,
      )
    ) {
      return false;
    }

    if (!matchesActiveState(event.isActive, filters.activeState)) return false;
    if (!matchesVisibilityState(event.isPublic, filters.visibilityState)) {
      return false;
    }

    if (
      filters.eventType &&
      filters.eventType !== "ALL" &&
      event.type !== filters.eventType
    ) {
      return false;
    }

    if (filters.eventMode && filters.eventMode !== "ALL") {
      const isHybrid = event.isRemote && event.isPhysical;
      const matchesMode =
        (filters.eventMode === "HYBRID" && isHybrid) ||
        (filters.eventMode === "REMOTE" && event.isRemote && !isHybrid) ||
        (filters.eventMode === "PHYSICAL" && event.isPhysical && !isHybrid);

      if (!matchesMode) return false;
    }

    if (!searchTerm) return true;

    const haystack = [
      event.id,
      event.name,
      event.description,
      event.type,
      getVerificationStatus(event.verificationStatus),
      event.entity?.name,
      event.location,
      event.meetingUrl,
      event.startDate,
      event.endDate,
      event.createdAt,
      regionText(event.targetRegions),
    ]
      .map(normalize)
      .join(" ");

    return haystack.includes(searchTerm);
  });
}

export function filterConferenceHallOffers(
  offers: Offer[],
  search: string,
  filters: BaseConferenceHallFilters = {},
) {
  const searchTerm = normalize(search);

  return offers.filter((offer) => {
    if (
      !matchesVerificationStatus(
        offer.verificationStatus,
        filters.verificationStatus,
      )
    ) {
      return false;
    }

    if (!matchesActiveState(offer.isActive, filters.activeState)) return false;

    if (!searchTerm) return true;

    const relationText =
      offer.offerRelations
        ?.map((relation) =>
          [
            relation.relationType,
            relation.category?.name,
            relation.brand?.name,
            relation.specification?.name,
            relation.item?.name,
            relation.itemListing?.id,
          ]
            .map(normalize)
            .join(" "),
        )
        .join(" ") || "";

    const detailText =
      offer.offerDetails
        ?.map((detail) =>
          [detail.startDate, detail.endDate, detail.publishedAt, detail.isPublic]
            .map(normalize)
            .join(" "),
        )
        .join(" ") || "";

    const haystack = [
      offer.id,
      offer.name,
      offer.description,
      getVerificationStatus(offer.verificationStatus),
      offer.entity?.name,
      offer.status,
      offer.createdAt,
      offer.updatedAt,
      relationText,
      detailText,
      regionText(offer.targetRegions),
    ]
      .map(normalize)
      .join(" ");

    return haystack.includes(searchTerm);
  });
}

export function filterConferenceHallContents(
  contents: Content[],
  search: string,
  filters: BaseConferenceHallFilters = {},
) {
  const searchTerm = normalize(search);

  return contents.filter((content) => {
    if (
      !matchesVerificationStatus(
        content.verificationStatus,
        filters.verificationStatus,
      )
    ) {
      return false;
    }

    if (!matchesActiveState(content.isActive, filters.activeState)) {
      return false;
    }
    if (!matchesVisibilityState(content.isPublic, filters.visibilityState)) {
      return false;
    }

    if (!searchTerm) return true;

    const attachmentText =
      content.attachments
        ?.map((attachment) =>
          [
            attachment.media?.name,
            attachment.media?.url,
            attachment.document?.name,
            attachment.document?.url,
          ]
            .map(normalize)
            .join(" "),
        )
        .join(" ") || "";

    const haystack = [
      content.id,
      content.name,
      content.description,
      getVerificationStatus(content.verificationStatus),
      content.createdAt,
      content.updatedAt,
      attachmentText,
      regionText(content.targetRegions),
    ]
      .map(normalize)
      .join(" ");

    return haystack.includes(searchTerm);
  });
}
