import React from "react";
import { Region } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { Select } from "../ui/Select.js";

interface RegionSelectProps {
  regions: Region[];
  value: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
}

export function RegionSelect({
  regions,
  value,
  onChange,
  disabled = false,
}: RegionSelectProps) {
  return (
    <Select
      id="region-filter-select"
      label={copy.dashboard.filterRegionLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      data-testid="region-select"
    >
      {regions.map((region) => (
        <option key={region.slug} value={region.slug}>
          {region.name} {!region.hasData ? `(${copy.states.emptyTitle})` : ""}
        </option>
      ))}
    </Select>
  );
}
