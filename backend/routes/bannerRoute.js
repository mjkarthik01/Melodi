import express from "express";
import formidable from "express-formidable";

import {
  uploadBanner,
  getBanners,
  deleteBanner,
  toggleBanner,
} from "../controllers/bannerController.js";

import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload-banner",
  requireSignIN,
  isAdmin,
  formidable(),
  uploadBanner,
);

router.get("/banners", getBanners);

router.delete("/delete-banner/:id", requireSignIN, isAdmin, deleteBanner);

router.put("/toggle-banner/:id", requireSignIN, isAdmin, toggleBanner);

export default router;
