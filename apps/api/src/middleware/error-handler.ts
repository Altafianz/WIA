import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError, SourceMeta } from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";

function getRequestId(req: Request, res: Response): string {
  const headerId = res.getHeader("x-request-id") ?? req.headers["x-request-id"];
  if (typeof headerId === "string" && headerId.length > 0) return headerId;
  if (Array.isArray(headerId) && headerId.length > 0) return String(headerId[0]);
  return "unknown";
}

function getErrorMeta(): ApiError["meta"] {
  try {
    const meta: SourceMeta = getRepository().getMeta();
    return {
      snapshotVersion: meta.snapshotVersion,
      dataStatus: meta.dataStatus === "ready" ? "ready" : "degraded",
      isFixture: meta.isFixture,
    };
  } catch {
    return null;
  }
}

function sendError(
  req: Request,
  res: Response,
  status: number,
  code: ApiError["error"]["code"],
  message: string,
  details?: unknown
): void {
  const body: ApiError = {
    error: {
      code,
      message,
      requestId: getRequestId(req, res),
      ...(details === undefined ? {} : { details }),
    },
    meta: getErrorMeta(),
  };
  res.status(status).json(body);
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    sendError(
      req,
      res,
      400,
      "VALIDATION_ERROR",
      "Parameter yang diberikan tidak valid.",
      err.errors.slice(0, 5).map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
    return;
  }

  sendError(
    req,
    res,
    500,
    "INTERNAL_ERROR",
    "Terjadi kesalahan internal server."
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(req, res, 404, "NOT_FOUND", "Endpoint tidak ditemukan.");
}
