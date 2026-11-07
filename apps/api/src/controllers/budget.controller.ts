import { Request, Response } from "express";
import {
  BudgetSummaryQuerySchema,
  BudgetSectorsQuerySchema,
  BudgetTrendQuerySchema,
  CompareQuerySchema,
} from "@danaterbuka/shared";
import { BudgetService } from "../services/budget.service.js";
import { getRepository } from "../repositories/index.js";
import { getDefaultRegionSlug, getLatestFinalYear } from "../lib/data-meta.js";

const budgetService = new BudgetService();

export function getBudgetSummary(req: Request, res: Response): void {
  const query = BudgetSummaryQuerySchema.parse(req.query);
  const repo = getRepository();
  const region = query.region ?? getDefaultRegionSlug(repo);
  const year = query.year ?? getLatestFinalYear(repo);
  const result = budgetService.getSummary(region, year);
  res.json(result);
}

export function getBudgetSectors(req: Request, res: Response): void {
  const query = BudgetSectorsQuerySchema.parse(req.query);
  const repo = getRepository();
  const region = query.region ?? getDefaultRegionSlug(repo);
  const year = query.year ?? getLatestFinalYear(repo);
  const result = budgetService.getSectors(region, year);
  res.json(result);
}

export function getBudgetTrend(req: Request, res: Response): void {
  const query = BudgetTrendQuerySchema.parse(req.query);
  const repo = getRepository();
  const region = query.region ?? getDefaultRegionSlug(repo);
  const result = budgetService.getTrend(region);
  res.json(result);
}

export function getBudgetCompare(req: Request, res: Response): void {
  const query = CompareQuerySchema.parse(req.query);
  const result = budgetService.getCompare(query);
  res.json(result);
}
