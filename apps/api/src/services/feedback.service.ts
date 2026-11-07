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

    // 4. Save to repository (file)
    try {
      await this.repository.save(record);
    } catch (saveError) {
      logger.error({ err: saveError }, "Gagal menulis saran ke file");
      throw new AppError(
        500,
        "INTERNAL_ERROR",
        "Gagal menyimpan saran. Silakan coba beberapa saat lagi."
      );
    }

    // Safe info log without message or contact
    logger.info(
      { category: record.category, timestamp: record.timestamp },
      "Saran baru berhasil disimpan"
    );

    // 5. Send Webhook notification if configured (timeout 5s, failure does not fail request)
    const webhookUrl =
      process.env.FEEDBACK_WEBHOOK_URL || env.FEEDBACK_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim().length > 0) {
      this.sendWebhook(webhookUrl, record);
    }

    return { ok: true, isHoneypot: false };
  }

  private async sendWebhook(
    url: string,
    record: FeedbackRecord
  ): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const content = `**[DanaTerbuka] Saran Baru (${record.category})**\nWaktu: ${record.timestamp}\nKontak: ${record.contact || "-"}\nPesan:\n${record.message}`;

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (webhookError) {
      logger.warn({ err: webhookError }, "Gagal mengirim webhook saran");
    }
  }
}

export const defaultFeedbackService = new FeedbackService();

