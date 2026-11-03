import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SummaryCards } from "../components/dashboard/SummaryCards.js";
import { DataTable } from "../components/common/DataTable.js";
import { SimpleModeHelp } from "../components/dashboard/SimpleModeHelp.js";
import { copy } from "../content/copy.id.js";

const mockSummary = {
  regionSlug: "provinsi-nusa-utara",
  fiscalYear: 2024,
  totalPagu: 2_400_000_000_000,
  totalRealisasi: 1_800_000_000_000,
  realizationRate: 75.0,
  remainingBudget: 600_000_000_000,
  sectorCount: 10,
  realisasiComplete: true,
  periodStatus: "final" as const,
};

const mockSlices = [
  {
    sectorId: "F07",
    name: "Kesehatan",
    pagu: 720_000_000_000,
    realisasi: 550_000_000_000,
    realizationRate: 76.4,
    share: 30.0,
    isAggregate: false,
  },
];

describe("Simple Mode Render Tests", () => {
  it("renders technical labels and tooltips in normal mode (simple=false)", () => {
    const html = renderToStaticMarkup(
      <SummaryCards summary={mockSummary} simple={false} state="data" />
    );

    expect(html).toContain(copy.dashboard.summaryPagu);
    expect(html).toContain(copy.dashboard.summaryRealisasi);
    expect(html).toContain(copy.dashboard.summaryRate);
    expect(html).toContain(copy.dashboard.summaryRemaining);
    expect(html).not.toContain(copy.dashboard.summaryPaguSimple);
    expect(html).not.toContain("Dari setiap Rp 100 yang direncanakan");
  });

  it("renders plain labels and per-Rp-100 sentence in simple mode (simple=true)", () => {
    const html = renderToStaticMarkup(
      <SummaryCards summary={mockSummary} simple={true} state="data" />
    );

    expect(html).toContain(copy.dashboard.summaryPaguSimple);
    expect(html).toContain(copy.dashboard.summaryRealisasiSimple);
    expect(html).toContain(copy.dashboard.summaryRateSimple);
    expect(html).toContain(copy.dashboard.summaryRemainingSimple);
    expect(html).toContain("Dari setiap Rp 100 yang direncanakan, sekitar Rp 75 sudah terpakai.");
  });

  it("changes DataTable headers when simple=true", () => {
    const normalHtml = renderToStaticMarkup(
      <DataTable slices={mockSlices} caption="Tabel Normal" simple={false} />
    );
    expect(normalHtml).toContain(copy.table.sectorHeader);
    expect(normalHtml).toContain(copy.table.paguHeader);
    expect(normalHtml).toContain(copy.table.realisasiHeader);
    expect(normalHtml).toContain(copy.table.rateHeader);

    const simpleHtml = renderToStaticMarkup(
      <DataTable slices={mockSlices} caption="Tabel Sederhana" simple={true} />
    );
    expect(simpleHtml).toContain(copy.table.sectorHeaderSimple);
    expect(simpleHtml).toContain(copy.table.paguHeaderSimple);
    expect(simpleHtml).toContain(copy.table.realisasiHeaderSimple);
    expect(simpleHtml).toContain(copy.table.rateHeaderSimple);
  });

  it("renders SimpleModeHelp box with copy text", () => {
    const html = renderToStaticMarkup(<SimpleModeHelp />);
    expect(html).toContain(copy.dashboard.simpleModeHelpTitle);
    expect(html).toContain(copy.dashboard.simpleModeHelpBody);
  });
});

