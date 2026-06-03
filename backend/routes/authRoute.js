import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.get("/test", requireSignIN, isAdmin, testController);
router.get("/user-auth", requireSignIN, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIN, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requireSignIN, updateProfileController);
router.get("/orders", requireSignIN, getOrdersController);
router.get("/user-orders", requireSignIN, getOrdersController);
router.get("/all-orders", requireSignIN, isAdmin, getAllOrdersController);
router.put(
  "/order-status/:orderId",
  requireSignIN,
  isAdmin,
  orderStatusController,
);

export default router;
