import { describe, it, expect } from "vitest";
import { copy } from "../content/copy.id.js";

describe("Web microcopy and basic setup", () => {
  it("loads Indonesian copy without error", () => {
    expect(copy.common.siteName).toBe("DanaTerbuka");
    expect(copy.nav.dashboard).toBe("Dashboard");
    expect(copy.dashboard.title).toBe("Dashboard Anggaran Daerah");
  });
});
