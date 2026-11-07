import { Request, Response, NextFunction } from "express";
import {
  FeedbackService,
  defaultFeedbackService,
} from "../services/feedback.service.js";

export class FeedbackController {
  constructor(
    private service: FeedbackService = defaultFeedbackService
  ) {}

  postFeedback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.service.submitFeedback(req.body);
      if (result.isHoneypot) {
        res.status(200).json({ ok: true });
        return;
      }
      res.status(201).json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}

export const defaultFeedbackController = new FeedbackController();

