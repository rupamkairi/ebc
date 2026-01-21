export const UNIT_TYPES = [
  "Nos",
  "Meter",
  "Feet",
  "Kilogram",
  "Litre",
  "SquareMeter",
  "SquareFeet",
  "CubicMeter",
  "CubicFeet",
  "Bag_50_KG",
] as const;

export type UnitType = (typeof UNIT_TYPES)[number];

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  Nos: "Nos",
  Meter: "Meter",
  Feet: "Feet",
  Kilogram: "Kilogram",
  Litre: "Litre",
  SquareMeter: "Square Meter",
  SquareFeet: "Square Feet",
  CubicMeter: "Cubic Meter",
  CubicFeet: "Cubic Feet",
  Bag_50_KG: "Bag (50 kg)",
};
