/**
 * Firebase Admin SDK initialization.
 *
 * Loads the service account from one of two sources (checked in order):
 *   1. FIREBASE_SERVICE_ACCOUNT env var (base64-encoded JSON) — for Vercel/serverless
 *   2. server/service-account.json on disk — for local development
 *
 * Never commit service-account.json — it's in .gitignore.
 *
 * Exports:
 *   - admin         — the firebase-admin namespace
 *   - firestore     — Firestore database instance
 *   - firebaseAuth  — Firebase Auth instance
 *
 * firebase-admin v14 uses modular imports:
 *   getFirestore from 'firebase-admin/firestore'
 *   getAuth      from 'firebase-admin/auth'
 */
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, unknown> | undefined} */
let serviceAccount;

// 1. Try FIREBASE_SERVICE_ACCOUNT env var (Vercel / serverless deployments)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'),
    );
  } catch (cause) {
    throw new Error(
      'Failed to parse FIREBASE_SERVICE_ACCOUNT env var. It must be the\n' +
        'contents of service-account.json, base64-encoded.\n' +
        '  PowerShell: [Convert]::ToBase64String([IO.File]::ReadAllBytes(\"server\\\\service-account.json\"))\n' +
        '  Linux/macOS: base64 -w0 server/service-account.json | pbcopy\n' +
        'See: ' +
        (cause instanceof Error ? cause.message : String(cause)),
    );
  }
}

// 2. Fall back to local file (development)
if (!serviceAccount) {
  try {
    serviceAccount = JSON.parse(
      readFileSync(resolve(__dirname, '..', '..', 'service-account.json'), 'utf-8'),
    );
  } catch (cause) {
    throw new Error(
      'Failed to load Firebase service account.\n' +
        'Either:\n' +
        '  1. Set FIREBASE_SERVICE_ACCOUNT env var (Vercel) — base64 of service-account.json\n' +
        '  2. Place server/service-account.json on disk (local dev)\n' +
        'See: ' +
        (cause instanceof Error ? cause.message : String(cause)),
    );
  }
}

admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

export const firestore = getFirestore();
export const firebaseAuth = getAuth();

export default admin;
