// Vercel Function entry point. It re-exports the compiled Express app so the
// function bundle consumes build output (shared + api are built before the
// function is bundled) rather than TypeScript sources.
export { default } from "../apps/api/dist/vercel-entry.js";
