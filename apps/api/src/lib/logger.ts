import pino from "pino";

export const logger = pino({
  name: "danaterbuka-api",
  level: process.env.LOG_LEVEL || "info",
});

