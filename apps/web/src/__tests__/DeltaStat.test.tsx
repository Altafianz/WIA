import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DeltaStat,
  formatSignedValue,
  getDeltaDirection,
} from "../components/compare/DeltaStat.js";

describe("DeltaStat", () => {
  it("shows an upward icon, plus signs, and the naik label", () => {
    const html = renderToStaticMarkup(
      <DeltaStat
        label="Total Pagu"
        aValue={2_400_000_000_000}
        bValue={2_000_000_000_000}
        delta={400_000_000_000}
        deltaPercent={20.0}
        format="rupiah"
      />
    );

    expect(html).toContain("+Rp 400,0 M");
    expect(html).toContain("+20,0%");
    expect(html).toContain("naik");
  });

  it("shows a downward icon and negative signs", () => {
    const html = renderToStaticMarkup(
      <DeltaStat
        label="Total Realisasi"
        aValue={1_500_000_000_000}
        bValue={1_800_000_000_000}
        delta={-300_000_000_000}
        deltaPercent={-16.7}
        format="rupiah"
      />
    );

    expect(html).toContain("-Rp 300,0 M");
    expect(html).toContain("-16,7%");
    expect(html).toContain("turun");
  });

  it("shows a neutral label when the delta is unavailable", () => {
    const html = renderToStaticMarkup(
      <DeltaStat
        label="Persentase Realisasi"
        aValue={null}
        bValue={null}
        delta={null}
        deltaPercent={null}
        format="percent"
      />
    );

    expect(html).toContain("—");
    expect(html).toContain("tidak berubah");
  });

  it("classifies directions and signs deterministically", () => {
    expect(getDeltaDirection(1)).toBe("up");
    expect(getDeltaDirection(-1)).toBe("down");
    expect(getDeltaDirection(0)).toBe("flat");
    expect(getDeltaDirection(null)).toBe("flat");
    expect(formatSignedValue(20, "percent")).toBe("+20,0%");
    expect(formatSignedValue(-20, "percent")).toBe("-20,0%");
  });
});
