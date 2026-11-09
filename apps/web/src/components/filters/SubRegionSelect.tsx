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

function optionLabel(sub: Region, index: number): string {
  const isFirstGov = index === 0 && sub.level === "province";
  const base = isFirstGov ? copy.dashboard.provinceGovOption : sub.name;
  return sub.hasData ? base : `${base} (${copy.states.emptyTitle})`;
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
  const provinceHintId = `${id}-province-hint`;
  const selectedSub = subRegions.find((sub) => sub.slug === value);
  const showProvinceHint =
    !isSingle &&
    selectedSub !== undefined &&
    subRegions[0]?.level === "province" &&
    selectedSub.slug === subRegions[0]?.slug;
  const describedBy = [
    isSingle ? descriptionId : undefined,
    showProvinceHint ? provinceHintId : undefined,
    ariaDescribedBy,
  ]
    .filter(Boolean)
    .join(" ");
  const effectiveDescribedBy = describedBy || undefined;

  const options = subRegions.map((sub, index) => {
    const label = optionLabel(sub, index);
    return (
      <option key={sub.slug} value={sub.slug} title={label}>
        {label}
      </option>
    );
  });

  return (
    <div className={`flex flex-col ${className ?? ""}`.trim()}>
      {isSingle ? (
        // A one-option native select clips long labels on narrow screens.
        // Show the full value as wrapping text and keep the disabled select
        // for form semantics and screen readers.
        <>
          <span className="text-sm font-semibold text-text">{label}</span>
          <div className="mt-1.5 flex min-h-12 items-center rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text">
            {subRegions[0]
              ? optionLabel(subRegions[0], 0)
              : copy.dashboard.singleSubRegionNotice}
          </div>
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled
            aria-hidden="true"
            tabIndex={-1}
            aria-describedby={effectiveDescribedBy}
            data-testid={testId}
            className="sr-only"
          >
            {options}
          </select>
        </>
      ) : (
        <Select
          id={id}
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={className}
          data-testid={testId}
          aria-describedby={effectiveDescribedBy}
        >
          {options}
        </Select>
      )}
      {showProvinceHint && (
        <p
          id={provinceHintId}
          className="mt-1.5 text-sm leading-relaxed text-text-muted lg:hidden"
        >
          {copy.dashboard.provinceGovOptionHint}
        </p>
      )}
      {isSingle && (
        <p id={descriptionId} className="mt-1.5 text-sm text-text-muted">
          {copy.dashboard.singleSubRegionNotice}
        </p>
      )}
    </div>
  );
}
