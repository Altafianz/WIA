import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`DanaTerbuka API listening on http://${env.HOST}:${env.PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
