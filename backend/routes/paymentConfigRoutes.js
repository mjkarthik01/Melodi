import express from "express";

import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";
import {
  getPaymentConfig,
  savePaymentConfig,
} from "../controllers/paymentConfigController.js";

const router = express.Router();

router.get("/payment-config", requireSignIN, isAdmin, getPaymentConfig);

router.post("/payment-config", requireSignIN, isAdmin, savePaymentConfig);

export default router;
