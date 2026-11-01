import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "node:path";
import fs from "node:fs";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { apiRateLimiter } from "./middleware/rate-limit.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  app.use(requestIdMiddleware);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
        },
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(cors());
  app.use(compression({ threshold: 1024 }));
  app.use(express.json({ limit: "32kb" }));

  // Mount API router
  app.use("/api", apiRateLimiter, apiRouter);

  // Serve static assets in production if apps/web/dist exists
  const webDist = path.resolve(process.cwd(), "apps/web/dist");
  if (fs.existsSync(webDist)) {
    app.use(express.static(webDist, { maxAge: "1y", immutable: true }));
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(webDist, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
