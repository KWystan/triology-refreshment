import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ─── Security headers ──────────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

// ─── Cookie parsing ─────────────────────────────────────────
app.use(cookieParser());

// ─── Request logging ───────────────────────────────────────
if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Body parsing ───────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── API routes ─────────────────────────────────────────────
app.use('/api', apiRouter);

// ─── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Not found' } });
});

// ─── Global error handler ───────────────────────────────────
app.use(errorHandler);

export { app };
