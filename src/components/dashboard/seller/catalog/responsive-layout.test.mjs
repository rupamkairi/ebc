import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editFormSource = readFileSync(
  new URL("./steps/listing-edit-form.tsx", import.meta.url),
  "utf8",
);
const listingCardSource = readFileSync(
  new URL("./listing-card.tsx", import.meta.url),
  "utf8",
);
const itemSearchSource = readFileSync(
  new URL("../../../advanced-forms/item-search/item-search.tsx", import.meta.url),
  "utf8",
);
const createListingModalSource = readFileSync(
  new URL(
    "../../../../app/(dashboard)/seller-dashboard/catalog/create-listing-modal.tsx",
    import.meta.url,
  ),
  "utf8",
);
const dialogSource = readFileSync(
  new URL("../../../ui/dialog.tsx", import.meta.url),
  "utf8",
);

test("edit listing tabs share mobile width and wrap long labels", () => {
  assert.match(
    editFormSource,
    /TabsList className="[^"]*h-auto[^"]*grid-cols-3[^"]*items-stretch[^"]*"/,
  );
  assert.equal(
    (editFormSource.match(
      /<TabsTrigger\s+[\s\S]*?className="[^"]*whitespace-normal[^"]*break-words[^"]*"/g,
    ) || []).length,
    3,
  );
});

test("listing cards reserve a visible mobile action area", () => {
  assert.match(
    listingCardSource,
    /className="[^"]*min-w-0[^"]*pr-12[^"]*md:pr-4[^"]*"/,
  );
  assert.match(
    listingCardSource,
    /className="[^"]*absolute[^"]*right-2[^"]*top-2[^"]*md:static[^"]*"/,
  );
});

test("item search cards wrap long names without increasing their width", () => {
  assert.match(
    itemSearchSource,
    /className="[^"]*w-full[^"]*max-w-full[^"]*min-w-0[^"]*"/,
  );
  assert.match(
    itemSearchSource,
    /<h4 className="[^"]*whitespace-normal[^"]*break-words[^"]*\[overflow-wrap:anywhere\][^"]*">/,
  );
  assert.doesNotMatch(
    itemSearchSource,
    /<h4 className="[^"]*truncate[^"]*">\s*\{item\.name\}/,
  );
});

test("create listing modal stays inside the mobile viewport", () => {
  assert.match(
    dialogSource,
    /w-\[calc\(100vw-2rem\)\][^"]*max-w-lg[^"]*overflow-x-hidden/,
  );
  assert.match(
    createListingModalSource,
    /DialogContent className="[^"]*max-w-4xl[^"]*overflow-x-hidden[^"]*"/,
  );
});

test("listing card names wrap instead of widening the card", () => {
  assert.equal(
    (listingCardSource.match(
      /<h3 className="[^"]*whitespace-normal[^"]*break-words[^"]*\[overflow-wrap:anywhere\][^"]*"/g,
    ) || []).length,
    2,
  );
});
