import { Request, Response } from "express";
import {
  BudgetSummaryQuerySchema,
  BudgetSectorsQuerySchema,
  BudgetTrendQuerySchema,
} from "@danaterbuka/shared";
import { BudgetService } from "../services/budget.service.js";

const budgetService = new BudgetService();

export function getBudgetSummary(req: Request, res: Response): void {
  const query = BudgetSummaryQuerySchema.parse(req.query);
  const result = budgetService.getSummary(query.region, query.year);
  res.json(result);
}

export function getBudgetSectors(req: Request, res: Response): void {
  const query = BudgetSectorsQuerySchema.parse(req.query);
  const result = budgetService.getSectors(query.region, query.year);
  res.json(result);
}

export function getBudgetTrend(req: Request, res: Response): void {
  const query = BudgetTrendQuerySchema.parse(req.query);
  const result = budgetService.getTrend(query.region);
  res.json(result);
}
