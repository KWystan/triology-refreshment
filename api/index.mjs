/**
 * Vercel serverless entry point.
 *
 * Imports the Express app and exports it as the default handler.
 * Vercel wraps the default export as a serverless function.
 *
 * All /api/* requests are routed here by vercel.json rewrites.
 * The Express app (mounted at /api) handles routing internally.
 */
import { app } from '../server/src/app.js';

export default app;
