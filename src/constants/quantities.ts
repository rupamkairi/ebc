import { UNIT_TYPE, UNIT_TYPE_LABELS } from "./enums";

export { UNIT_TYPE, UNIT_TYPE_LABELS };

export const UNIT_TYPES = Object.values(UNIT_TYPE) as [
  UNIT_TYPE,
  ...UNIT_TYPE[],
];

export type UnitType = UNIT_TYPE;

export const UNIT_TYPE_OPTIONS = UNIT_TYPES.map((value) => ({
  value,
  label: UNIT_TYPE_LABELS[value],
}));

const normalizeUnitTypeKey = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const unitTypeLookup = new Map<string, UnitType>();
for (const unit of UNIT_TYPES) {
  unitTypeLookup.set(normalizeUnitTypeKey(unit), unit);
  unitTypeLookup.set(normalizeUnitTypeKey(UNIT_TYPE_LABELS[unit]), unit);
}

const legacyUnitAliases: Record<string, UnitType> = {
  metre: UNIT_TYPE.Meter,
  foot: UNIT_TYPE.Feet,
  number: UNIT_TYPE.Nos,
  squaremetre: UNIT_TYPE.SquareMeter,
  squarefoot: UNIT_TYPE.SquareFeet,
  cubicmetre: UNIT_TYPE.CubicMeter,
  cubicfoot: UNIT_TYPE.CubicFeet,
};

for (const [alias, unit] of Object.entries(legacyUnitAliases)) {
  unitTypeLookup.set(alias, unit);
}

export const isUnitType = (value: unknown): value is UnitType =>
  typeof value === "string" &&
  (UNIT_TYPES as readonly string[]).includes(value);

export const resolveUnitType = (value: unknown): UnitType | undefined => {
  if (typeof value !== "string") return undefined;
  const key = normalizeUnitTypeKey(value.trim());
  return key ? unitTypeLookup.get(key) : undefined;
};

export const formatUnitType = (value: string | null | undefined): string => {
  if (!value) return "-";
  return isUnitType(value) ? UNIT_TYPE_LABELS[value] : value;
};

export const filterUnitTypes = (
  units: readonly UnitType[],
  query: string,
): UnitType[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [...units];

  return units.filter((unit) =>
    `${unit} ${UNIT_TYPE_LABELS[unit]}`.toLowerCase().includes(normalizedQuery),
  );
};
