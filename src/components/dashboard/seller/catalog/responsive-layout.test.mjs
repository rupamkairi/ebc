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

test("edit listing tabs share mobile width and wrap long labels", () => {
  assert.match(
    editFormSource,
    /TabsList className="[^"]*h-auto[^"]*grid-cols-3[^"]*items-stretch[^"]*"/,
  );
  assert.equal(
    (editFormSource.match(
      /TabsTrigger[\s\S]*?className="[^"]*whitespace-normal[^"]*break-words[^"]*"/g,
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
