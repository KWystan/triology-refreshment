import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from the server package root
dotenv.config({ path: resolve(__dirname, '..', '..', '.env') });

/** @param {string} name */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy server/.env.example → server/.env and fill in the value.`,
    );
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  SUPABASE_URL: required('SUPABASE_URL'),
  SUPABASE_PUBLISHABLE_KEY: required('SUPABASE_PUBLISHABLE_KEY'),
  SUPABASE_SECRET_KEY: required('SUPABASE_SECRET_KEY'),
  SUPABASE_JWKS_URL: process.env.SUPABASE_JWKS_URL,

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret-change-me',

  // ─── Cloudinary ─────────────────────────────────────────────
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,

  // ─── Admin ───────────────────────────────────────────────────
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',

  get isDev() {
    return this.NODE_ENV === 'development';
  },
  get isProd() {
    return this.NODE_ENV === 'production';
  },
};
