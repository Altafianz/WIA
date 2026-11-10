import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createApp } from "../app.js";
import { resetFeedbackRateLimits } from "../middleware/feedback-rate-limit.js";

describe("Feedback API (POST /api/feedback)", () => {
  let tempFilePath: string;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    // Unique temp file for feedback testing
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "danaterbuka-feedback-"));
    tempFilePath = path.join(tempDir, "feedback.jsonl");
    process.env.FEEDBACK_FILE = tempFilePath;
    delete process.env.FEEDBACK_WEBHOOK_URL;
    resetFeedbackRateLimits();
    app = createApp();
  });

  afterEach(() => {
    delete process.env.VERCEL;
    delete process.env.FEEDBACK_WEBHOOK_URL;
    vi.unstubAllGlobals();
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        fs.rmdirSync(path.dirname(tempFilePath));
      }
    } catch {
      // Ignore cleanup error
    }
  });

  it("POST /api/feedback saves feedback and returns 201 with ok: true", async () => {
    const payload = {
      category: "fitur",
      message: "Tolong tambahkan fitur grafik perbandingan antar sektor.",
      contact: "pengguna@example.com",
    };

    const res = await request(app).post("/api/feedback").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });

    // Verify written file
    expect(fs.existsSync(tempFilePath)).toBe(true);
    const content = fs.readFileSync(tempFilePath, "utf-8").trim();
    const lines = content.split("\n").filter(Boolean);
    expect(lines.length).toBe(1);

    const record = JSON.parse(lines[0]);
    expect(record.category).toBe("fitur");
    expect(record.message).toBe("Tolong tambahkan fitur grafik perbandingan antar sektor.");
    expect(record.contact).toBe("pengguna@example.com");
    expect(record.timestamp).toBeTruthy();
    // Must NOT contain IP
    expect(record.ip).toBeUndefined();
  });

  it("fails validation (400) when message is shorter than 10 characters", async () => {
    const payload = {
      category: "data",
      message: "Pendek",
    };

    const res = await request(app).post("/api/feedback").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("fails validation (400) when category is invalid", async () => {
    const payload = {
      category: "tidak-valid",
      message: "Saran dengan kategori yang salah tapi teks panjang.",
    };

    const res = await request(app).post("/api/feedback").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("fails validation (400) when unknown fields are provided", async () => {
    const payload = {
      category: "tampilan",
      message: "Tampilan dashboard di mobile sudah sangat baik.",
      fieldAsing: "tidak boleh ada",
    };

    const res = await request(app).post("/api/feedback").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 200 when honeypot website is filled, but does NOT save to file", async () => {
    const payload = {
      category: "lainnya",
      message: "Pesan spam dari bot pencari celah formulir otomatis.",
      website: "https://spam-bot.site",
    };

    const res = await request(app).post("/api/feedback").send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });

    // File should not exist or be empty
    if (fs.existsSync(tempFilePath)) {
      const content = fs.readFileSync(tempFilePath, "utf-8").trim();
      expect(content).toBe("");
    }
  });

  it("enforces rate limiting: 6th submission from same IP returns 429", async () => {
    const payload = {
      category: "fitur",
      message: "Saran berulang untuk menguji batas laju permintaan.",
    };

    // First 5 should succeed
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post("/api/feedback").send(payload);
      expect(res.status).toBe(201);
    }

    // 6th should be rejected with 429
    const blockedRes = await request(app).post("/api/feedback").send(payload);
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.body.error.code).toBe("RATE_LIMITED");
    expect(blockedRes.body.error.message).toContain("Terlalu banyak");
  });

  it("does not fail the request when webhook delivery fails", async () => {
    // Set invalid webhook URL that will fail
    process.env.FEEDBACK_WEBHOOK_URL = "http://127.0.0.1:1/invalid-webhook";

    const payload = {
      category: "data",
      message: "Angka anggaran tahun 2024 sangat lengkap dan jelas.",
    };

    const res = await request(app).post("/api/feedback").send(payload);

    // Request still succeeds with 201
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });

    // File is saved
    expect(fs.existsSync(tempFilePath)).toBe(true);
  });

  it("skips file storage on Vercel and succeeds when the webhook is delivered", async () => {
    process.env.VERCEL = "1";
    process.env.FEEDBACK_WEBHOOK_URL = "https://example.test/webhook";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app).post("/api/feedback").send({
      category: "fitur",
      message: "Saran dari lingkungan serverless yang tidak bisa menulis berkas.",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fs.existsSync(tempFilePath)).toBe(false);
  });

  it("returns 503 with a generic message when Vercel has no webhook", async () => {
    process.env.VERCEL = "1";
    delete process.env.FEEDBACK_WEBHOOK_URL;

    const res = await request(app).post("/api/feedback").send({
      category: "data",
      message: "Saran tanpa webhook di lingkungan yang tidak dapat menulis.",
    });

    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe("DATA_UNAVAILABLE");
    expect(res.body.error.message).not.toContain(tempFilePath);
  });

  it("succeeds through the webhook when the feedback file cannot be written", async () => {
    // Put a regular file where the repository expects a directory so mkdir fails.
    fs.writeFileSync(tempFilePath, "blocker");
    process.env.FEEDBACK_FILE = path.join(tempFilePath, "feedback.jsonl");
    process.env.FEEDBACK_WEBHOOK_URL = "https://example.test/webhook";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app).post("/api/feedback").send({
      category: "lainnya",
      message: "Saran tetap terkirim walau penyimpanan berkas gagal.",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("uses x-forwarded-for for rate limiting only when TRUST_PROXY=1", async () => {
    const originalTrustProxy = process.env.TRUST_PROXY;
    const payload = {
      category: "fitur",
      message: "Saran berulang untuk menguji header proxy tepercaya.",
    };

    try {
      process.env.TRUST_PROXY = "1";
      resetFeedbackRateLimits();
      const trustedApp = createApp();

      for (let i = 0; i < 6; i += 1) {
        const res = await request(trustedApp)
          .post("/api/feedback")
          .set("x-forwarded-for", `203.0.113.${i + 1}`)
          .send(payload);
        expect(res.status).toBe(201);
      }

      process.env.TRUST_PROXY = "0";
      resetFeedbackRateLimits();
      const untrustedApp = createApp();

      for (let i = 0; i < 5; i += 1) {
        await request(untrustedApp)
          .post("/api/feedback")
          .set("x-forwarded-for", `198.51.100.${i + 1}`)
          .send(payload);
      }

      const blocked = await request(untrustedApp)
        .post("/api/feedback")
        .set("x-forwarded-for", "198.51.100.99")
        .send(payload);
      expect(blocked.status).toBe(429);
    } finally {
      if (originalTrustProxy === undefined) {
        delete process.env.TRUST_PROXY;
      } else {
        process.env.TRUST_PROXY = originalTrustProxy;
      }
      resetFeedbackRateLimits();
    }
  });
});

