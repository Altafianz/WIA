import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors.js";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const rateLimitMap = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries every 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Don't keep Node process alive just for the cleanup timer
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

export function resetFeedbackRateLimits(): void {
  rateLimitMap.clear();
}

export function feedbackRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();

  let entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    entry = { count: 1, resetTime: now + WINDOW_MS };
    rateLimitMap.set(ip, entry);
    return next();
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSec));
    return next(
      new AppError(
        429,
        "RATE_LIMITED",
        "Terlalu banyak saran yang dikirim dari alamat ini. Silakan coba lagi setelah 10 menit."
      )
    );
  }

  return next();
}

