import mongoose from "mongoose";

const sendRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedRecipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["assigned", "posted", "cancelled", "expired"],
    default: "assigned",
  },
  addressSnapshot: {
    // copy of recipient address info when assigned (optional)
    name: String,
    addressLines: [String],
    postalCode: String,
    country: String,
  },
  postedAt: Date,
  expiresAt: Date,
});

export default mongoose.model("SendRequest", sendRequestSchema);
