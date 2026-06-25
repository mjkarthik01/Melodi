import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    usedBy: [
      {
        type: mongoose.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("coupons", couponSchema);
