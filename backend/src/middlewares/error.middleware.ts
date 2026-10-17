import { ErrorRequestHandler } from "express";
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) =>
  res.status(500).json({ error: err.message || "Internal server error" });
