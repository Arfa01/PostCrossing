import mongoose from "mongoose";

const postcardSchema = new mongoose.Schema({
  postcardCode: { type: String, unique: true, required: true }, // e.g., "US-11797804"
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  imageUrl: String, // image of the postcard
  fromCountry: String,
  toCountry: String,
  status: {
    type: String,
    enum: ["traveling", "sent", "received"],
    default: "traveling",
  },
  sentAt: { type: Date, default: Date.now },
  receivedAt: { type: Date },
});

export default mongoose.model("Postcard", postcardSchema);
