import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "node:fs/promises";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import {
  requireApiKey,
  ApiKeyRequest,
} from "../middlewares/api-key.middleware.js";
import {
  originalDir,
  uniqueFilename,
  safePath,
} from "../services/storage.service.js";
const upload = multer({
  storage: multer.diskStorage({
    destination: originalDir,
    filename: (_req, file, cb) => cb(null, uniqueFilename(file.originalname)),
  }),
  limits: { files: 10, fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});
const router = Router();
router.post(
  "/",
  requireApiKey,
  upload.array("images", 10),
  async (req, res, next) => {
    const files = (req.files || []) as Express.Multer.File[];
    try {
      if (!files.length)
        return res
          .status(400)
          .json({
            success: false,
            error: "At least one image is required in field images",
          });
      const auth = (req as ApiKeyRequest).apiKey!;
      const processed = await Promise.all(files.map(async (file) => {
        const webpFilename = uniqueFilename(file.originalname).replace(/\.[^.]+$/, ".webp");
        const webpPath = safePath(originalDir, webpFilename);
        await sharp(file.path)
          .rotate()
          .webp({ quality: 85, effort: 6 })
          .toFile(webpPath);
        await fs.rm(file.path, { force: true });
        const stat = await fs.stat(webpPath);
        return { file, filename: webpFilename, size: stat.size };
      }));
      const records = (await prisma.$transaction(
        processed.map(({ file, filename, size }) =>
          prisma.imageMetadata.create({
            data: {
              userId: auth.userId,
              apiKeyId: auth.id,
              originalName: file.originalname,
              filename,
              mimeType: "image/webp",
              sizeBytes: BigInt(size),
            },
          }),
        ),
      )) as Array<{
        id: string;
        originalName: string;
        filename: string;
        sizeBytes: bigint;
      }>;
      const data = records.map((record) => ({
        id: record.id,
        original_name: record.originalName,
        cdn_url:
          env.CDN_BASE_URL + "/cdn/" + encodeURIComponent(record.filename),
        size_bytes: Number(record.sizeBytes),
      }));
      if (data.length === 1)
        return res
          .status(201)
          .json({
            success: true,
            message: "1 file uploaded successfully",
            data: data[0],
          });
      return res
        .status(201)
        .json({
          success: true,
          message: data.length + " files uploaded successfully",
          data,
        });
    } catch (error) {
      await Promise.all(
        files.map((file) =>
          fs
            .rm(safePath(originalDir, file.filename), { force: true })
            .catch(() => undefined),
        ),
      );
      next(error);
    }
  },
);
export default router;
