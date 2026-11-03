import { Router } from "express";
import {
  getBudgetCompare,
  getBudgetSummary,
  getBudgetSectors,
  getBudgetTrend,
} from "../controllers/budget.controller.js";

export const budgetRouter = Router();
budgetRouter.get("/budget/summary", getBudgetSummary);
budgetRouter.get("/budget/sectors", getBudgetSectors);
budgetRouter.get("/budget/trend", getBudgetTrend);
budgetRouter.get("/budget/compare", getBudgetCompare);
