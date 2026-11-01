import { Request, Response } from "express";
import { MetaService } from "../services/meta.service.js";

const metaService = new MetaService();

export function getMeta(_req: Request, res: Response): void {
  const result = metaService.getMetaInfo();
  res.json(result);
}
