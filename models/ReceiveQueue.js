import mongoose from "mongoose";

const receiveQueueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  enqueuedAt: { type: Date, default: Date.now }
});

receiveQueueSchema.index({ enqueuedAt: 1 }); // for oldest-first queries

export default mongoose.model("ReceiveQueue", receiveQueueSchema);
