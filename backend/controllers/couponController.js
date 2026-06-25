import CouponModel from "../models/CouponModel.js";
import { nanoid } from "nanoid";

export const createCouponController = async (req, res) => {
  try {
    const { percentage, expiryDate } = req.body;

    const coupon = await CouponModel.create({
      code: `SAVE-${nanoid(8).toUpperCase()}`,
      percentage,
      expiryDate,
    });

    res.status(201).send({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
    });
  }
};

export const getCouponsController = async (req, res) => {
  const coupons = await CouponModel.find({}).sort({
    createdAt: -1,
  });

  res.send({
    success: true,
    coupons,
  });
};

export const deleteCouponController = async (req, res) => {
  await CouponModel.findByIdAndDelete(req.params.id);

  res.send({
    success: true,
  });
};

export const validateCouponController = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await CouponModel.findOne({
      code,
      active: true,
    });

    if (!coupon) {
      return res.send({
        success: false,
        message: "Invalid coupon",
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.send({
        success: false,
        message: "Coupon expired",
      });
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return res.send({
        success: false,
        message: "Already used",
      });
    }

    res.send({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
