import React from "react";
import { copy } from "../../content/copy.id.js";
import { Select } from "../ui/Select.js";

interface YearSelectProps {
  years: number[];
  value: number;
  onChange: (year: number) => void;
  disabled?: boolean;
}

export function YearSelect({
  years,
  value,
  onChange,
  disabled = false,
}: YearSelectProps) {
  return (
    <Select
      id="year-filter-select"
      label={copy.dashboard.filterYearLabel}
      value={value.toString()}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      data-testid="year-select"
    >
      {years.map((year) => (
        <option key={year} value={year.toString()}>
          {year}
        </option>
      ))}
    </Select>
  );
}
