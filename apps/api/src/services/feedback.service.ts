import { FeedbackInput, FeedbackInputSchema } from "@danaterbuka/shared";
import { AppError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import {
  FeedbackRecord,
  FeedbackRepository,
  defaultFeedbackRepository,
} from "../repositories/feedback.repository.js";
import { env } from "../env.js";

export interface SubmitFeedbackResult {
  ok: true;
  isHoneypot: boolean;
}

export class FeedbackService {
  constructor(
    private repository: FeedbackRepository = defaultFeedbackRepository
  ) {}

  async submitFeedback(body: unknown): Promise<SubmitFeedbackResult> {
    // 1. Check honeypot field
    if (
      typeof body === "object" &&
      body !== null &&
      "website" in body &&
      typeof (body as { website?: unknown }).website === "string" &&
      ((body as { website: string }).website || "").trim().length > 0
    ) {
      // Honeypot trapped: return success status without saving
      return { ok: true, isHoneypot: true };
    }

    // 2. Strict Zod validation
    const validated: FeedbackInput = FeedbackInputSchema.parse(body);

    // 3. Prepare storage record (ISO timestamp, category, message, contact, NO IP)
    const record: FeedbackRecord = {
      timestamp: new Date().toISOString(),
      category: validated.category,
      message: validated.message,
      contact: validated.contact && validated.contact.trim().length > 0
        ? validated.contact.trim()
        : null,
    };

    // 4. Save to repository (file). Vercel Functions have a read-only bundle
    // filesystem, so storage is optional there; surviving on the webhook alone
    // is expected. A failed local write is handled the same way elsewhere.
    const webhookUrl =
      process.env.FEEDBACK_WEBHOOK_URL || env.FEEDBACK_WEBHOOK_URL;
    const hasWebhook = Boolean(webhookUrl && webhookUrl.trim().length > 0);
    const canWriteFiles = !process.env.VERCEL;

    let stored = false;
    if (canWriteFiles) {
      try {
        await this.repository.save(record);
        stored = true;
      } catch (saveError) {
        logger.error({ err: saveError }, "Gagal menulis saran ke file");
      }
    }

    // Safe info log without message or contact
    logger.info(
      { category: record.category, timestamp: record.timestamp, stored },
      stored ? "Saran baru berhasil disimpan" : "Saran baru diterima"
    );

    // 5. Send Webhook notification if configured. The request must be awaited
    // before responding because serverless runtimes can freeze work that runs
    // after the response (timeout 5s, failure does not fail the request).
    let webhookDelivered = false;
    if (hasWebhook) {
      webhookDelivered = await this.sendWebhook(webhookUrl as string, record);
    }

    if (!stored && !webhookDelivered) {
      throw new AppError(
        503,
        "DATA_UNAVAILABLE",
        "Layanan saran sedang tidak tersedia. Silakan coba beberapa saat lagi."
      );
    }

    return { ok: true, isHoneypot: false };
  }

  private async sendWebhook(
    url: string,
    record: FeedbackRecord
  ): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const content = `**[DanaTerbuka] Saran Baru (${record.category})**\nWaktu: ${record.timestamp}\nKontak: ${record.contact || "-"}\nPesan:\n${record.message}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          signal: controller.signal,
        });

        return response.ok;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (webhookError) {
      logger.warn({ err: webhookError }, "Gagal mengirim webhook saran");
      return false;
    }
  }
}

export const defaultFeedbackService = new FeedbackService();

