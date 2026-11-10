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
import { WEB_DIST_DIR } from "./config/constants.js";

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

// Vite emits content-hashed filenames (e.g. index-aajSc1Xs.js, inter-latin-....woff2).
const HASHED_ASSET_PATTERN = /-[A-Za-z0-9_-]{8,}\.[A-Za-z0-9]+$/;

function isHashedAsset(relativePath: string): boolean {
  const normalized = relativePath.split(path.sep).join("/");
  return normalized.startsWith("assets/") && HASHED_ASSET_PATTERN.test(normalized);
}

function resolveTrustProxy(rawValue: string | undefined): boolean | number | string {
  if (!rawValue) return false;

  const value = rawValue.trim();
  if (value === "" || value === "false" || value === "0") return false;
  if (value === "true") return true;
  // "1" means exactly one proxy hop in front of the app.
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  const trustProxyEnv = process.env.TRUST_PROXY ?? env.TRUST_PROXY;
  app.set("trust proxy", resolveTrustProxy(trustProxyEnv));

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
          formAction: ["'self'"],
          // The app is served over HTTPS in production; upgrading is unnecessary
          // and breaks plain-HTTP local/preview runs.
          upgradeInsecureRequests: null,
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

  // Serve the web build (apps/web/dist) from the same Express service.
  const webDist = options.webDist ?? WEB_DIST_DIR;
  if (fs.existsSync(webDist)) {
    app.use(
      express.static(webDist, {
        setHeaders: (res, filePath) => {
          const relativePath = path.relative(webDist, filePath);
          if (isHashedAsset(relativePath)) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable"
            );
          } else {
            // index.html and root metadata must revalidate so deploys appear.
            res.setHeader("Cache-Control", "no-cache");
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
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(webDist, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
