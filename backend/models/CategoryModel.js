import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
});

// Add index for slug lookups
categorySchema.index({ slug: 1 });

export default mongoose.model("category", categorySchema);
