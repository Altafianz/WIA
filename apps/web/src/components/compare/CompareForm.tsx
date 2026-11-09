import React, { useMemo } from "react";
import { Region } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { CompareMode } from "../../lib/compare-params.js";
import { Select } from "../ui/Select.js";
import { ProvinceSelect } from "../filters/ProvinceSelect.js";
import { SubRegionSelect } from "../filters/SubRegionSelect.js";
import {
  groupRegions,
  getProvinceOf,
  getSubRegions,
} from "../../lib/region-grouping.js";

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

export function CompareForm({
  values,
  regions,
  years,
  onChange,
  disabled = false,
}: CompareFormProps) {
  const { mode, a, b, year, yearA, yearB } = values;

  const provinceGroups = useMemo(() => groupRegions(regions), [regions]);
  const provinces = useMemo(
    () => provinceGroups.map((g) => g.province),
    [provinceGroups]
  );

  const provA = useMemo(() => getProvinceOf(a, regions), [a, regions]);
  const provASlug = provA?.slug ?? provinces[0]?.slug ?? "";
  const subRegionsA = useMemo(
    () => getSubRegions(provASlug, regions),
    [provASlug, regions]
  );

  const provB = useMemo(() => getProvinceOf(b, regions), [b, regions]);
  const provBSlug = provB?.slug ?? provinces[0]?.slug ?? "";
  const subRegionsB = useMemo(
    () => getSubRegions(provBSlug, regions),
    [provBSlug, regions]
  );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <Select
        id="compare-mode"
        label={copy.compare.modeLabel}
        value={mode}
        onChange={(event) =>
          onChange({ mode: event.target.value as CompareMode })
        }
        disabled={disabled}
        data-testid="compare-mode"
      >
        <option value="region">{copy.compare.modeRegion}</option>
        <option value="year">{copy.compare.modeYear}</option>
      </Select>

      {mode === "region" ? (
        <>
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

          <ProvinceSelect
            id="compare-province-a"
            label={copy.compare.provinceALabel}
            provinces={provinces}
            value={provASlug}
            onChange={(slug) => onChange({ a: slug })}
            disabled={disabled}
            data-testid="compare-province-a"
          />

          <SubRegionSelect
            id="compare-subregion-a"
            label={copy.compare.subRegionALabel}
            subRegions={subRegionsA}
            value={a}
            onChange={(slug) => onChange({ a: slug })}
            disabled={disabled}
            data-testid="compare-subregion-a"
          />

          <ProvinceSelect
            id="compare-province-b"
            label={copy.compare.provinceBLabel}
            provinces={provinces}
            value={provBSlug}
            onChange={(slug) => onChange({ b: slug })}
            disabled={disabled}
            data-testid="compare-province-b"
          />

          <SubRegionSelect
            id="compare-subregion-b"
            label={copy.compare.subRegionBLabel}
            subRegions={subRegionsB}
            value={b}
            onChange={(slug) => onChange({ b: slug })}
            disabled={disabled}
            data-testid="compare-subregion-b"
          />
        </>
      ) : (
        <>
          <ProvinceSelect
            id="compare-province-a"
            label={copy.compare.provinceLabel}
            provinces={provinces}
            value={provASlug}
            onChange={(slug) => onChange({ a: slug })}
            disabled={disabled}
            data-testid="compare-province-a"
          />

          <SubRegionSelect
            id="compare-subregion-a"
            label={copy.compare.subRegionLabel}
            subRegions={subRegionsA}
            value={a}
            onChange={(slug) => onChange({ a: slug })}
            disabled={disabled}
            data-testid="compare-subregion-a"
          />

          <Select
            id="compare-year-a"
            label={copy.compare.yearALabel}
            value={String(yearA)}
            onChange={(event) =>
              onChange({ yearA: Number(event.target.value) })
            }
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
            onChange={(event) =>
              onChange({ yearB: Number(event.target.value) })
            }
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
