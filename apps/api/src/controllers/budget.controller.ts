import { Request, Response } from "express";
import {
  BudgetSummaryQuerySchema,
  BudgetSectorsQuerySchema,
  BudgetTrendQuerySchema,
  DEFAULT_REGION_SLUG,
  DEFAULT_FISCAL_YEAR,
} from "@danaterbuka/shared";
import { BudgetService } from "../services/budget.service.js";

const budgetService = new BudgetService();

export function getBudgetSummary(req: Request, res: Response): void {
  const query = BudgetSummaryQuerySchema.parse(req.query);
  const region = query.region ?? DEFAULT_REGION_SLUG;
  const year = query.year ?? DEFAULT_FISCAL_YEAR;
  const result = budgetService.getSummary(region, year);
  res.json(result);
}

export function getBudgetSectors(req: Request, res: Response): void {
  const query = BudgetSectorsQuerySchema.parse(req.query);
  const region = query.region ?? DEFAULT_REGION_SLUG;
  const year = query.year ?? DEFAULT_FISCAL_YEAR;
  const result = budgetService.getSectors(region, year);
  res.json(result);
}

export function getBudgetTrend(req: Request, res: Response): void {
  const query = BudgetTrendQuerySchema.parse(req.query);
  const region = query.region ?? DEFAULT_REGION_SLUG;
  const result = budgetService.getTrend(region);
  res.json(result);
}
