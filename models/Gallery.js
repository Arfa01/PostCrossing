import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postcard: { type: mongoose.Schema.Types.ObjectId, ref: "Postcard" },
  imageUrl: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("GalleryItem", galleryItemSchema);
