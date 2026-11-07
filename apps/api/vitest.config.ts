import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      DATA_ADAPTER: "fixture",
      DEFAULT_REGION_SLUG: "provinsi-nusa-utara",
    },
  },
});
