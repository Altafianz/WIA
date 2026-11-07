import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { loadEnv } from "../env.js";

describe("Environment loading (loadEnv)", () => {
  let tempDir: string;
  let tempEnvPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "danaterbuka-env-test-"));
    tempEnvPath = path.join(tempDir, ".env");
  });

  afterEach(() => {
    try {
      if (fs.existsSync(tempEnvPath)) {
        fs.unlinkSync(tempEnvPath);
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir);
      }
    } catch {
      // ignore cleanup error
    }
    delete process.env.TEST_EXISTING_KEY;
    delete process.env.TEST_NEW_KEY;
  });

  it("loads variables from .env and does not overwrite existing environment variables", () => {
    // 1. Set an existing environment variable in process.env
    process.env.TEST_EXISTING_KEY = "existing_value_from_process";
    delete process.env.TEST_NEW_KEY;

    // 2. Create a .env file containing both existing and new keys
    const envContent = [
      "TEST_EXISTING_KEY=overwritten_value_from_file",
      "TEST_NEW_KEY=loaded_from_env_file",
    ].join("\n");
    fs.writeFileSync(tempEnvPath, envContent, "utf-8");

    // 3. Load the temp .env file
    loadEnv(tempEnvPath);

    // 4. Assert: new variable was loaded from .env
    expect(process.env.TEST_NEW_KEY).toBe("loaded_from_env_file");

    // 5. Assert: existing variable was NOT overwritten by .env
    expect(process.env.TEST_EXISTING_KEY).toBe("existing_value_from_process");
  });

  it("does not throw or fail when .env file does not exist", () => {
    const nonExistentPath = path.join(tempDir, "nonexistent.env");
    expect(() => loadEnv(nonExistentPath)).not.toThrow();
  });
});

