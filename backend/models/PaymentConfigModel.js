import mongoose from "mongoose";

const paymentConfigSchema = new mongoose.Schema(
  {
    merchantId: {
      type: String,
      required: true,
    },

    publicKey: {
      type: String,
      required: true,
    },

    privateKey: {
      type: String,
      required: true,
    },

    environment: {
      type: String,
      enum: ["Sandbox", "Production"],
      default: "Sandbox",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("PaymentConfig", paymentConfigSchema);
