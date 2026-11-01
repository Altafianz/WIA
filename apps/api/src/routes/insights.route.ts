import { Router } from "express";
import { getInsights } from "../controllers/insights.controller.js";

export const insightsRouter = Router();
insightsRouter.get("/insights", getInsights);
