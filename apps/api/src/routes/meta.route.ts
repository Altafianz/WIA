import { Router } from "express";
import { getMeta } from "../controllers/meta.controller.js";

export const metaRouter = Router();
metaRouter.get("/meta", getMeta);
