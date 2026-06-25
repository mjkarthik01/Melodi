import express from "express";

import {
  createCouponController,
  getCouponsController,
  deleteCouponController,
  validateCouponController,
} from "../controllers/couponController.js";

import { requireSignIN, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", requireSignIN, isAdmin, createCouponController);

router.get("/all", requireSignIN, isAdmin, getCouponsController);

router.delete("/:id", requireSignIN, isAdmin, deleteCouponController);

router.post("/validate", requireSignIN, validateCouponController);

export default router;
