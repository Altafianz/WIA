import { ApiError } from "@danaterbuka/shared";

export class AppError extends Error {
  status: number;
  code: ApiError["error"]["code"];
  details?: unknown;

  constructor(
    status: number,
    code: ApiError["error"]["code"],
    message: string,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
