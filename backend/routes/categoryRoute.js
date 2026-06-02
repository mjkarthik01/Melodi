import express from "express";
import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";
import {
  categorController,
  createCategoryController,
  deleteCategoryController,
  singleCategorController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignIN,
  isAdmin,
  createCategoryController,
);

router.put(
  "/update-category/:id",
  requireSignIN,
  isAdmin,
  updateCategoryController,
);

router.get("/get-category", categorController);
router.get("/single-category/:slug", singleCategorController);
router.delete(
  "/delete-category/:id",
  requireSignIN,
  isAdmin,
  deleteCategoryController,
);
export default router;
