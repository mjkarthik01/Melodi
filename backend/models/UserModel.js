import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: String,

    currentAddress: {
      type: String,
      default: "",
    },

    addresses: [
      {
        type: String,
      },
    ],

    answer: String,

    role: {
      type: Number,
      default: 0,
    },

    usedCoupons: [
      {
        type: String,
      },
    ],

    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("users", userSchema);
