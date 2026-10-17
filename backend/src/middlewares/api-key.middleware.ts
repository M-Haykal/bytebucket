import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
export type ApiKeyRequest = Express.Request & {
  apiKey?: { id: string; userId: string };
};
export const requireApiKey: RequestHandler = async (req, res, next) => {
  try {
    const raw = req.header("X-API-Key");
    if (!raw)
      return res
        .status(401)
        .json({ success: false, error: "X-API-Key header is required" });
    const keys = await prisma.apiKey.findMany({ where: { status: "active" } });
    let match: any;
    for (const key of keys) {
      if (await bcrypt.compare(raw, key.keyHash)) {
        match = key;
        break;
      }
    }
    if (!match)
      return res
        .status(401)
        .json({ success: false, error: "Invalid or revoked API key" });
    await prisma.apiKey.update({
      where: { id: match.id },
      data: { lastUsedAt: new Date() },
    });
    (req as ApiKeyRequest).apiKey = { id: match.id, userId: match.userId };
    next();
  } catch (error) {
    next(error);
  }
};
