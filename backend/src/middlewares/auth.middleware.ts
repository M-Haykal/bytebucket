import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export type AuthRequest = Express.Request & { userId?: string };
export const requireAuth: RequestHandler = (req, res, next) => {
  const t = req.headers.authorization?.replace("Bearer ", "");
  if (!t) return res.status(401).json({ error: "Authentication required" });
  try {
    (req as AuthRequest).userId = (jwt.verify(t, env.JWT_SECRET) as any).sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
