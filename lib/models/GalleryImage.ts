import mongoose from "mongoose";

const GalleryImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.GalleryImage ||
  mongoose.model("GalleryImage", GalleryImageSchema);
