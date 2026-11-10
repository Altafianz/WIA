import { createApp } from "./app.js";

// Vercel Functions must not call listen(); the platform invokes the exported
// Express app. URL normalisation is enabled for rewritten/catch-all requests.
const app = createApp({ normalizeVercelUrl: true });

export default app;
