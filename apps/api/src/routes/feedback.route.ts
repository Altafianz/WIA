import express, { Router } from "express";
import { defaultFeedbackController } from "../controllers/feedback.controller.js";
import { feedbackRateLimiter } from "../middleware/feedback-rate-limit.js";

export const feedbackRouter = Router();

feedbackRouter.post(
  "/",
  feedbackRateLimiter,
  express.json({ limit: "10kb" }),
  defaultFeedbackController.postFeedback
);

