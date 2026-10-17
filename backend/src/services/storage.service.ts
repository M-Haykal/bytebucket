import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
export const originalDir = path.join(env.STORAGE_PATH, "original");
export const cacheDir = path.join(env.STORAGE_PATH, "cache");
export const initStorage = async () => {
  await fs.mkdir(originalDir, { recursive: true });
  await fs.mkdir(cacheDir, { recursive: true });
};
export const uniqueFilename = (name: string) =>
  Date.now() + "-" + randomUUID() + path.extname(name).toLowerCase();
export const safePath = (dir: string, name: string) => {
  const p = path.resolve(dir, name);
  if (!p.startsWith(path.resolve(dir) + path.sep))
    throw new Error("Invalid filename");
  return p;
};
