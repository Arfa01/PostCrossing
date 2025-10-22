import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    totalSent: { type: Number, default: 0, min: 0 },
    totalReceived: { type: Number, default: 0, min: 0 },
    countriesSentTo: { type: [String], default: [] },
    countriesReceivedFrom: { type: [String], default: [] },
    averageTravelDays: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Index for quick lookups
userStatsSchema.index({ user: 1 });

export default mongoose.model("UserStats", userStatsSchema);
