import { Router } from "express";
import { getRegions } from "../controllers/regions.controller.js";

export const regionsRouter = Router();
regionsRouter.get("/regions", getRegions);
