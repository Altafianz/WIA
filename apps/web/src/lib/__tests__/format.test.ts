import { describe, it, expect } from "vitest";
import { formatPerHundred, formatRupiahCompact, formatPercent } from "../format.js";

describe("formatPerHundred", () => {
  it("returns null message when rate is null or undefined", () => {
    expect(formatPerHundred(null)).toBe("Realisasi belum dirilis.");
    expect(formatPerHundred(undefined)).toBe("Realisasi belum dirilis.");
  });

  it("returns exceeds message when rate > 100", () => {
    expect(formatPerHundred(100.1)).toBe("Uang yang terpakai melebihi rencana.");
    expect(formatPerHundred(125)).toBe("Uang yang terpakai melebihi rencana.");
  });

  it("rounds rate to integer and formats sentence", () => {
    expect(formatPerHundred(75.0)).toBe(
      "Dari setiap Rp 100 yang direncanakan, sekitar Rp 75 sudah terpakai."
    );
    expect(formatPerHundred(41.7)).toBe(
      "Dari setiap Rp 100 yang direncanakan, sekitar Rp 42 sudah terpakai."
    );
    expect(formatPerHundred(0)).toBe(
      "Dari setiap Rp 100 yang direncanakan, sekitar Rp 0 sudah terpakai."
    );
  });
});

describe("other format functions", () => {
  it("formats compact rupiah properly", () => {
    expect(formatRupiahCompact(2_400_000_000_000)).toBe("Rp 2,4 T");
    expect(formatRupiahCompact(600_000_000_000)).toBe("Rp 600,0 M");
    expect(formatRupiahCompact(null)).toBe("-");
  });

  it("formats percent properly", () => {
    expect(formatPercent(75.0)).toBe("75,0%");
    expect(formatPercent(null)).toBe("-");
  });
});

