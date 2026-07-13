/**
 * Firebase Admin SDK initialization.
 *
 * Reads the service account credentials from server/service-account.json.
 * Never commit this file — it's in .gitignore.
 *
 * Exports:
 *   - admin      — the firebase-admin namespace (for initializeApp, cert, timestamps)
 *   - firestore  — Firestore database instance
 *   - firebaseAuth — Firebase Auth instance
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

try {
  serviceAccount = JSON.parse(
    readFileSync(resolve(__dirname, '..', '..', 'service-account.json'), 'utf-8'),
  );
} catch (cause) {
  throw new Error(
    'Failed to load Firebase service account from server/service-account.json.\n' +
      'Make sure the file exists and is valid JSON.\n' +
      'See: ' +
      (cause instanceof Error ? cause.message : String(cause)),
  );
}

admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

export const firestore = getFirestore();
export const firebaseAuth = getAuth();

export default admin;
