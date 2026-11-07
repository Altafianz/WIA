import { describe, it, expect } from "vitest";
import {
  getSimpleText,
  getSectorChartCopy,
  getTrendChartCopy,
  getDataTableCopy,
  getInsightPanelCopy,
  getPeriodNoticeCopy,
  getLegacyDataNoticeCopy,
  getCompareCopy,
} from "../simple-text.js";
import { copy } from "../../content/copy.id.js";

describe("simple-text helpers", () => {
  it("getSimpleText picks text according to mode", () => {
    expect(getSimpleText(false, "Normal", "Sederhana")).toBe("Normal");
    expect(getSimpleText(true, "Normal", "Sederhana")).toBe("Sederhana");
  });

  it("getSectorChartCopy returns correct titles and descriptions", () => {
    const normal = getSectorChartCopy(false);
    expect(normal.title).toBe(copy.dashboard.sectorChartTitle);
    expect(normal.description).toBe(copy.dashboard.sectorChartDescription);

    const simple = getSectorChartCopy(true);
    expect(simple.title).toBe(copy.dashboard.sectorChartTitleSimple);
    expect(simple.description).toBe(copy.dashboard.sectorChartDescriptionSimple);
  });

  it("getTrendChartCopy returns correct titles and descriptions", () => {
    const normal = getTrendChartCopy(false);
    expect(normal.title).toBe(copy.dashboard.trendChartTitle);

    const simple = getTrendChartCopy(true);
    expect(simple.title).toBe(copy.dashboard.trendChartTitleSimple);
  });

  it("getDataTableCopy returns headers based on mode", () => {
    const normal = getDataTableCopy(false);
    expect(normal.sectorHeader).toBe(copy.table.sectorHeader);
    expect(normal.paguHeader).toBe(copy.table.paguHeader);

    const simple = getDataTableCopy(true);
    expect(simple.sectorHeader).toBe(copy.table.sectorHeaderSimple);
    expect(simple.paguHeader).toBe(copy.table.paguHeaderSimple);
  });

  it("getInsightPanelCopy returns title based on mode", () => {
    expect(getInsightPanelCopy(false).title).toBe(copy.dashboard.insightPanelTitle);
    expect(getInsightPanelCopy(true).title).toBe(copy.dashboard.insightPanelTitleSimple);
  });

  it("getPeriodNoticeCopy returns appropriate notice based on status and mode", () => {
    expect(getPeriodNoticeCopy(false, "approved")).toBe(copy.dashboard.realizationNotReleased);
    expect(getPeriodNoticeCopy(true, "approved")).toBe(
      copy.dashboard.realizationNotReleasedSimple
    );
    expect(getPeriodNoticeCopy(false, "partial")).toBe(copy.dashboard.partialRealizationNotice);
    expect(getPeriodNoticeCopy(true, "partial")).toBe(
      copy.dashboard.partialRealizationNoticeSimple
    );
  });

  it("getLegacyDataNoticeCopy returns the 2021-2022 comparison warning", () => {
    expect(getLegacyDataNoticeCopy(false)).toBe(copy.dashboard.legacyDataNotice);
    expect(getLegacyDataNoticeCopy(true)).toBe(copy.dashboard.legacyDataNoticeSimple);
    expect(getLegacyDataNoticeCopy(false)).toContain(
      "Angka 2021-2022 kurang tepat untuk dibandingkan."
    );
    expect(getLegacyDataNoticeCopy(true)).toContain(
      "Angka 2021-2022 sebaiknya jangan dibandingkan dulu."
    );
    expect(getLegacyDataNoticeCopy(false)).toContain("Selengkapnya di Metodologi.");
    expect(getLegacyDataNoticeCopy(true)).toContain("Selengkapnya di Metodologi.");
  });

  it("getCompareCopy returns comparison labels", () => {
    const normal = getCompareCopy(false);
    expect(normal.title).toBe(copy.compare.title);

    const simple = getCompareCopy(true);
    expect(simple.title).toBe(copy.compare.titleSimple);
  });
});

