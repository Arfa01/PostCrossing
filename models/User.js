import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  country: String,
  address: String,
  avatarUrl: String, // for wall/profile
  bio: String,
  sentCount: { type: Number, default: 0 },
  receivedCount: { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
