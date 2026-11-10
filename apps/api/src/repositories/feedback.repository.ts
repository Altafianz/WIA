import fs from "node:fs";
import path from "node:path";
import { FeedbackCategory } from "@danaterbuka/shared";
import { env } from "../env.js";
import { resolveFromRepoRoot } from "../config/constants.js";

export interface FeedbackRecord {
  timestamp: string;
  category: FeedbackCategory;
  message: string;
  contact?: string | null;
}

export interface FeedbackRepository {
  save(record: FeedbackRecord): Promise<void>;
}

export class FileFeedbackRepository implements FeedbackRepository {
  private getFilePath(): string {
    const raw =
      process.env.FEEDBACK_FILE ||
      env.FEEDBACK_FILE ||
      "data/feedback/feedback.jsonl";
    return resolveFromRepoRoot(raw);
  }

  async save(record: FeedbackRecord): Promise<void> {
    const filePath = this.getFilePath();
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    const line = JSON.stringify(record) + "\n";
    await fs.promises.appendFile(filePath, line, "utf-8");
  }
}

export const defaultFeedbackRepository: FeedbackRepository = new FileFeedbackRepository();

