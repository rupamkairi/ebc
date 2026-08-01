export const OPENROUTER_FREE_ROUTER = "openrouter/free";

export const isFreeOpenRouterModel = (model: string) =>
  model === OPENROUTER_FREE_ROUTER || model.endsWith(":free");

export const parseFreeOpenRouterModels = (
  value: string | undefined,
  fallback: readonly string[],
) => {
  const configured = (value || "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean)
    .filter(isFreeOpenRouterModel);

  const models = configured.length > 0 ? configured : fallback;
  return [...new Set([...models, OPENROUTER_FREE_ROUTER])];
};
