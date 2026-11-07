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
import { env } from "./env.js";

export interface CreateAppOptions {
  webDist?: string;
}

const SEO_ROOT_FILES = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.svg",
]);

export function isSpaFallbackPath(pathname: string): boolean {
  const cleanPath = pathname.split("?")[0] || pathname;
  if (cleanPath === "/api" || cleanPath.startsWith("/api/")) return false;
  return !SEO_ROOT_FILES.has(cleanPath);
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  const trustProxyEnv = process.env.TRUST_PROXY || env.TRUST_PROXY;
  if (trustProxyEnv) {
    if (trustProxyEnv === "true" || trustProxyEnv === "1") {
      app.set("trust proxy", true);
    } else if (trustProxyEnv === "false" || trustProxyEnv === "0") {
      app.set("trust proxy", false);
    } else {
      app.set("trust proxy", trustProxyEnv);
    }
  }

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
  const webDist =
    options.webDist ?? path.resolve(process.cwd(), "apps/web/dist");
  if (fs.existsSync(webDist)) {
    app.use(
      express.static(webDist, {
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
          if (SEO_ROOT_FILES.has(`/${path.basename(filePath)}`)) {
            res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
          }
        },
      })
    );
    app.get(/.*/, (req, res, next) => {
      // SEO files are served by express.static; never replace them with the SPA shell.
      if (!isSpaFallbackPath(req.path)) {
        next();
        return;
      }
      res.sendFile(path.join(webDist, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
