import { UNIT_TYPE, UNIT_TYPE_LABELS } from "./enums";

export { UNIT_TYPE, UNIT_TYPE_LABELS };

export const UNIT_TYPES = Object.values(UNIT_TYPE) as [
  UNIT_TYPE,
  ...UNIT_TYPE[],
];

export type UnitType = UNIT_TYPE;
