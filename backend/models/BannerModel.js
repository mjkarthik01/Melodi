import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      required: true, // Cloudinary secure_url
    },

    cloudinary_id: {
      type: String, // 👈 REQUIRED for delete/update in Cloudinary
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Banner", bannerSchema);
