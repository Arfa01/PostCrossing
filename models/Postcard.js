import mongoose from "mongoose";

const postcardSchema = new mongoose.Schema(
  {
    postcardCode: {
      type: String,
      unique: true,
      required: [true, "Postcard code is required"],
      match: [/^[A-Z]{2}-\d{3,10}$/, "Invalid postcard code format"],     // postcard regex validation
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, maxlength: 600 },
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400?text=Postcard",
    },
    fromCountry: { type: String, required: true, trim: true },
    toCountry: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["traveling", "sent", "received"],
      default: "traveling",
      index: true,                                           // faster querying by status (idk yet, might add this as a query field later)
    },
    sentAt: { type: Date, default: Date.now },
    receivedAt: { type: Date },
  },
  { timestamps: true }
);




// index for fast lookups by sender/receiver
postcardSchema.index({ sender: 1 });
postcardSchema.index({ receiver: 1 });
postcardSchema.index({ postcardCode: 1 });




export default mongoose.model("Postcard", postcardSchema);
