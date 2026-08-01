import assert from "node:assert/strict";
import test from "node:test";
import {
  isFreeOpenRouterModel,
  parseFreeOpenRouterModels,
} from "./openrouter-models.ts";

const fallback = [
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/free",
];

test("accepts explicit free models and the OpenRouter free router", () => {
  assert.equal(isFreeOpenRouterModel(fallback[0]), true);
  assert.equal(isFreeOpenRouterModel(fallback[1]), true);
});

test("removes paid models from environment configuration", () => {
  assert.deepEqual(
    parseFreeOpenRouterModels(
      "google/gemma-4-31b-it, google/gemma-4-26b-a4b-it:free, openrouter/free",
      fallback,
    ),
    fallback,
  );
});

test("uses verified free defaults when configuration contains no free model", () => {
  assert.deepEqual(
    parseFreeOpenRouterModels("google/gemma-4-31b-it", fallback),
    fallback,
  );
});

test("always keeps the availability-aware free router as the final fallback", () => {
  assert.deepEqual(
    parseFreeOpenRouterModels("google/gemma-4-26b-a4b-it:free", fallback),
    fallback,
  );
});
