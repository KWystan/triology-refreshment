/**
 * Cloudinary configuration.
 *
 * Parses CLOUDINARY_URL env var (set in server/.env) and
 * configures the v2 SDK explicitly.
 *
 * Example CLOUDINARY_URL:
 *   cloudinary://api_key:api_secret@cloud_name
 */
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

if (!env.CLOUDINARY_URL) {
  throw new Error(
    'Missing CLOUDINARY_URL environment variable.\n' +
      'Add it to server/.env: cloudinary://api_key:api_secret@cloud_name\n' +
      'Get your credentials from https://cloudinary.com/console',
  );
}

// Parse cloudinary://api_key:api_secret@cloud_name
const match = env.CLOUDINARY_URL.match(
  /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/,
);
if (!match) {
  throw new Error(
    'Cloudinary failed to parse CLOUDINARY_URL.\n' +
      'Expected format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME',
  );
}

const [, api_key, api_secret, cloud_name] = match;

cloudinary.config({ cloud_name, api_key, api_secret });

export default cloudinary;
