import { Request, Response } from "express";
import { getRepository } from "../repositories/index.js";

export function getHealth(_req: Request, res: Response): void {
  const repo = getRepository();
  const meta = repo.getMeta();
  res.json({
    status: "ok",
    dataStatus: meta.dataStatus,
    recordCount: meta.recordCount,
    timestamp: new Date().toISOString(),
  });
}
