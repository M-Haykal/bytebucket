import 'dotenv/config';
import path from 'node:path';
export const env = {
  PORT: Number(process.env.PORT || 4000),
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  STORAGE_PATH: path.resolve(process.env.STORAGE_PATH || './uploads'),
  CDN_BASE_URL: process.env.CDN_BASE_URL || 'http://localhost:4000'
};
