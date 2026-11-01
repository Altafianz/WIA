import { Router } from "express";
import { healthRouter } from "./health.route.js";
import { metaRouter } from "./meta.route.js";
import { regionsRouter } from "./regions.route.js";
import { sectorsRouter } from "./sectors.route.js";
import { budgetRouter } from "./budget.route.js";
import { insightsRouter } from "./insights.route.js";

export const apiRouter = Router();
apiRouter.use(healthRouter);
apiRouter.use(metaRouter);
apiRouter.use(regionsRouter);
apiRouter.use(sectorsRouter);
apiRouter.use(budgetRouter);
apiRouter.use(insightsRouter);
