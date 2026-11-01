import { Request, Response } from "express";
import { getRepository } from "../repositories/index.js";

export function getSectors(_req: Request, res: Response): void {
  const repo = getRepository();
  res.json({
    meta: repo.getMeta(),
    data: repo.listSectors(),
  });
}
