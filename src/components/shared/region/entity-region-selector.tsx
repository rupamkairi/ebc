"use client";

import { useState } from "react";
import { Plus, X, Globe, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateSearchAutocomplete } from "@/components/autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "@/components/autocompletes/district-search-autocomplete";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { RegionScopeInput, RegionScopeType, PincodeRecord } from "@/types/region";
import { cn } from "@/lib/utils";

const SCOPE_LABELS: Record<RegionScopeType, string> = {
  PAN_INDIA: "Entire India",
  STATE: "State",
  DISTRICT: "District",
  PINCODE: "Pincode",
};

type RegionEntry = RegionScopeInput & { label: string };

function buildLabel(r: RegionScopeInput, pincodeRecord?: PincodeRecord | null): string {
  if (r.scopeType === "PAN_INDIA") return "Entire India";
  if (r.scopeType === "STATE") return `Whole State: ${r.state}`;
  if (r.scopeType === "DISTRICT") return `Whole District: ${r.district}, ${r.state}`;
  if (r.scopeType === "PINCODE") {
    if (pincodeRecord) return `${pincodeRecord.pincode} - ${pincodeRecord.district}`;
    if (r.pincode) return `${r.pincode} - ${r.district}`;
    if (r.district && r.state) return `${r.district}, ${r.state} (Pincode)`;
    return r.pincodeId ?? "Pincode";
  }
  return r.scopeType;
}

interface EntityRegionSelectorProps {
  regions: RegionScopeInput[];
  onChange: (regions: RegionScopeInput[]) => void;
  /** When provided, entries matching these regions are styled as "inherited" (amber). Non-matching entries are styled as "listing-specific" (sky). */
  inheritedRegions?: RegionScopeInput[];
}

function isInherited(r: RegionScopeInput, inherited: RegionScopeInput[]): boolean {
  return inherited.some(
    (ir) =>
      ir.scopeType === r.scopeType &&
      ir.state === r.state &&
      ir.district === r.district &&
      ir.pincodeId === r.pincodeId,
  );
}

export function EntityRegionSelector({ regions, onChange, inheritedRegions }: EntityRegionSelectorProps) {
  const [scopeType, setScopeType] = useState<RegionScopeType>("PINCODE");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pincodeId, setPincodeId] = useState("");
  const [pincodeRecord, setPincodeRecord] = useState<PincodeRecord | null>(null);

  // `lastEmitted` tracks the stripped regions array we last passed to onChange.
  // After a user edit, parent's `regions` prop === lastEmitted (same reference).
  // After a server-load, regions !== lastEmitted → external change → re-sync entries.
  const [lastEmitted, setLastEmitted] = useState<RegionScopeInput[]>(regions);
  const [prevRegions, setPrevRegions] = useState(regions);
  const [entries, setEntries] = useState<RegionEntry[]>(() =>
    regions.map((r) => ({ ...r, label: buildLabel(r) })),
  );

  // Derived-state sync (React pattern: setState during render for derived state).
  // Re-initializes entries when regions prop changes from an external source.
  if (prevRegions !== regions) {
    setPrevRegions(regions);
    if (lastEmitted !== regions) {
      setEntries(regions.map((r) => ({ ...r, label: buildLabel(r) })));
    }
  }

  const syncUp = (next: RegionEntry[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stripped = next.map(({ label: _label, ...r }) => r);
    setLastEmitted(stripped);
    setEntries(next);
    onChange(stripped);
  };

  const resetForm = () => {
    setState("");
    setDistrict("");
    setPincodeId("");
    setPincodeRecord(null);
  };

  const canAdd = () => {
    if (scopeType === "PAN_INDIA") return true;
    if (scopeType === "STATE") return !!state;
    if (scopeType === "DISTRICT") return !!state && !!district;
    if (scopeType === "PINCODE") return !!pincodeId;
    return false;
  };

  const isDuplicate = (r: RegionScopeInput) =>
    entries.some((e) => {
      if (e.scopeType !== r.scopeType) return false;
      if (r.scopeType === "PAN_INDIA") return true;
      if (r.scopeType === "STATE") return e.state === r.state;
      if (r.scopeType === "DISTRICT") return e.state === r.state && e.district === r.district;
      if (r.scopeType === "PINCODE") return e.pincodeId === r.pincodeId;
      return false;
    });

  const handleAdd = () => {
    const newRegion: RegionScopeInput = {
      scopeType,
      state: scopeType === "PINCODE" ? (pincodeRecord?.state ?? null) : (state || null),
      district:
        scopeType === "DISTRICT"
          ? (district || null)
          : scopeType === "PINCODE"
            ? (pincodeRecord?.district ?? null)
            : null,
      pincodeId: scopeType === "PINCODE" ? (pincodeId || null) : null,
    };
    if (!isDuplicate(newRegion)) {
      syncUp([...entries, { ...newRegion, label: buildLabel(newRegion, pincodeRecord) }]);
    }
    if (scopeType !== "PAN_INDIA") resetForm();
  };

  const handleRemove = (index: number) => {
    syncUp(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/10 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-muted-foreground">Scope</Label>
            <Select
              value={scopeType}
              onValueChange={(v) => {
                setScopeType(v as RegionScopeType);
                resetForm();
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SCOPE_LABELS) as RegionScopeType[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {SCOPE_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(scopeType === "STATE" || scopeType === "DISTRICT") && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">State</Label>
              <StateSearchAutocomplete
                value={state}
                onValueChange={(v) => {
                  setState(v);
                  setDistrict("");
                }}
              />
            </div>
          )}

          {scopeType === "DISTRICT" && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">District</Label>
              <DistrictSearchAutocomplete
                state={state}
                value={district}
                onValueChange={setDistrict}
                disabled={!state}
              />
            </div>
          )}

          {scopeType === "PINCODE" && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Pincode</Label>
              <PincodeSearchAutocomplete
                value={pincodeId}
                onValueChange={setPincodeId}
                onRecordSelect={(record) => {
                  setPincodeId(record.id);
                  setPincodeRecord(record);
                }}
                placeholder="Search pincode..."
              />
            </div>
          )}
        </div>

        <Button type="button" size="sm" onClick={handleAdd} disabled={!canAdd()} className="gap-2">
          <Plus size={14} /> Add Region
        </Button>
      </div>

      {entries.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {entries.map((r, i) => {
            const inherited = inheritedRegions ? isInherited(r, inheritedRegions) : null;
            const badgeClass = cn(
              "pl-2 pr-1 py-1 gap-1 flex items-center text-xs",
              inherited === true
                ? "bg-amber-50 text-amber-800 border border-amber-300"
                : inherited === false
                  ? "bg-sky-50 text-sky-800 border border-sky-300"
                  : "bg-secondary text-secondary-foreground border border-transparent",
            );
            return (
              <Badge key={i} variant="outline" className={badgeClass}>
                {r.scopeType === "PAN_INDIA" && <Globe size={12} className="mr-1 text-primary" />}
                {r.scopeType === "STATE" && <Navigation size={12} className="mr-1" />}
                {r.scopeType === "DISTRICT" && <MapPin size={12} className="mr-1" />}
                {r.label}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full transition-colors"
                >
                  <X size={12} />
                </button>
              </Badge>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          No availability regions set. Add one above.
        </p>
      )}
    </div>
  );
}
