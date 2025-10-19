import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalSent: { type: Number, default: 0 },
  totalReceived: { type: Number, default: 0 },
  countriesSentTo: [String],
  countriesReceivedFrom: [String],
  averageTravelDays: Number,
});

export default mongoose.model("UserStats", userStatsSchema);
