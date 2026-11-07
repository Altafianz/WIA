import React from "react";
import { Region } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { Select } from "../ui/Select.js";

export interface ProvinceSelectProps {
  provinces: Region[];
  value: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
  className?: string;
  "data-testid"?: string;
  "aria-describedby"?: string;
}

export function ProvinceSelect({
  provinces,
  value,
  onChange,
  disabled = false,
  id = "province-filter-select",
  label = copy.dashboard.filterProvinceLabel,
  className,
  "data-testid": testId = "province-select",
  "aria-describedby": ariaDescribedBy,
}: ProvinceSelectProps) {
  return (
    <Select
      id={id}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={className}
      data-testid={testId}
      aria-describedby={ariaDescribedBy}
    >
      {provinces.map((prov) => (
        <option key={prov.slug} value={prov.slug}>
          {prov.name} {!prov.hasData ? `(${copy.states.emptyTitle})` : ""}
        </option>
      ))}
    </Select>
  );
}

