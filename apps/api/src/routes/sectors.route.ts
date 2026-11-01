import { Router } from "express";
import { getSectors } from "../controllers/sectors.controller.js";

export const sectorsRouter = Router();
sectorsRouter.get("/sectors", getSectors);
