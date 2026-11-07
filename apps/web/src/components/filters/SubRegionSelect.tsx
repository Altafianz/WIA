import React from "react";
import { Region } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { Select } from "../ui/Select.js";

export interface SubRegionSelectProps {
  subRegions: Region[];
  value: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
  className?: string;
  "data-testid"?: string;
  "aria-describedby"?: string;
}

export function SubRegionSelect({
  subRegions,
  value,
  onChange,
  disabled = false,
  id = "subregion-filter-select",
  label = copy.dashboard.filterSubRegionLabel,
  className,
  "data-testid": testId = "subregion-select",
  "aria-describedby": ariaDescribedBy,
}: SubRegionSelectProps) {
  const isSingle = subRegions.length <= 1;
  const descriptionId = `${id}-description`;
  const effectiveDescribedBy = isSingle ? descriptionId : ariaDescribedBy;

  return (
    <div className={`flex flex-col ${className ?? ""}`.trim()}>
      <Select
        id={id}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isSingle}
        className={className}
        data-testid={testId}
        aria-describedby={effectiveDescribedBy}
      >
        {subRegions.map((sub, index) => {
          const isFirstGov = index === 0 && sub.level === "province";
          const labelText = isFirstGov
            ? copy.dashboard.provinceGovOption
            : sub.name;
          return (
            <option key={sub.slug} value={sub.slug}>
              {labelText} {!sub.hasData ? `(${copy.states.emptyTitle})` : ""}
            </option>
          );
        })}
      </Select>
      {isSingle && (
        <p id={descriptionId} className="text-xs text-text-muted mt-1">
          {copy.dashboard.singleSubRegionNotice}
        </p>
      )}
    </div>
  );
}

