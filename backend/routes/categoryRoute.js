import express from "express";
import formidable from "express-formidable";

import {
  categorController,
  createCategoryController,
  deleteCategoryController,
  singleCategorController,
  updateCategoryController,
  categoryPhotoController,
} from "../controllers/categoryController.js";

import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignIN,
  isAdmin,
  formidable(),
  createCategoryController,
);

router.put(
  "/update-category/:id",
  requireSignIN,
  isAdmin,
  formidable(),
  updateCategoryController,
);

router.get("/get-category", categorController);

router.get("/single-category/:slug", singleCategorController);

router.get("/category-photo/:id", categoryPhotoController);

router.delete(
  "/delete-category/:id",
  requireSignIN,
  isAdmin,
  deleteCategoryController,
);

export default router;
