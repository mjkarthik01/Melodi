import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: String,
    address: {},
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
  },
  { timestamps: true },
);

export default mongoose.model("users", userSchema);
