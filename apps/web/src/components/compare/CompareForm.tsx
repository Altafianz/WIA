import React from "react";
import { Region } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { CompareMode } from "../../lib/compare-params.js";
import { Select } from "../ui/Select.js";

export interface CompareFormValues {
  mode: CompareMode;
  a: string;
  b: string;
  year: number;
  yearA: number;
  yearB: number;
}

interface CompareFormProps {
  values: CompareFormValues;
  regions: Region[];
  years: number[];
  onChange: (patch: Partial<CompareFormValues>) => void;
  disabled?: boolean;
}

function regionLabel(region: Region): string {
  return region.hasData
    ? region.name
    : `${region.name} ${copy.compare.noDataRegion}`;
}

export function CompareForm({
  values,
  regions,
  years,
  onChange,
  disabled = false,
}: CompareFormProps) {
  const { mode, a, b, year, yearA, yearB } = values;

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2 lg:grid-cols-4">
      <Select
        id="compare-mode"
        label={copy.compare.modeLabel}
        value={mode}
        onChange={(event) => onChange({ mode: event.target.value as CompareMode })}
        disabled={disabled}
        data-testid="compare-mode"
      >
        <option value="region">{copy.compare.modeRegion}</option>
        <option value="year">{copy.compare.modeYear}</option>
      </Select>

      <Select
        id="compare-region-a"
        label={copy.compare.regionALabel}
        value={a}
        onChange={(event) => onChange({ a: event.target.value })}
        disabled={disabled}
        data-testid="compare-region-a"
      >
        {regions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {regionLabel(region)}
          </option>
        ))}
      </Select>

      {mode === "region" ? (
        <>
          <Select
            id="compare-region-b"
            label={copy.compare.regionBLabel}
            value={b}
            onChange={(event) => onChange({ b: event.target.value })}
            disabled={disabled}
            data-testid="compare-region-b"
          >
            {regions.map((region) => (
              <option key={region.slug} value={region.slug}>
                {regionLabel(region)}
              </option>
            ))}
          </Select>

          <Select
            id="compare-year"
            label={copy.compare.yearLabel}
            value={String(year)}
            onChange={(event) => onChange({ year: Number(event.target.value) })}
            disabled={disabled}
            data-testid="compare-year"
          >
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </>
      ) : (
        <>
          <Select
            id="compare-year-a"
            label={copy.compare.yearALabel}
            value={String(yearA)}
            onChange={(event) => onChange({ yearA: Number(event.target.value) })}
            disabled={disabled}
            data-testid="compare-year-a"
          >
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>

          <Select
            id="compare-year-b"
            label={copy.compare.yearBLabel}
            value={String(yearB)}
            onChange={(event) => onChange({ yearB: Number(event.target.value) })}
            disabled={disabled}
            data-testid="compare-year-b"
          >
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </>
      )}
    </div>
  );
}
