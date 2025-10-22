import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    address: { type: String, trim: true },
    avatarUrl: {
      type: String,
      default: "https://placehold.co/100x100?text=Avatar",
    },
    bio: { type: String, maxlength: 300 },
    sentCount: { type: Number, default: 0 },
    receivedCount: { type: Number, default: 0 },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);




// adding indexes so my project feels more professional (faster search)
userSchema.index({ username: 1 });
userSchema.index({ country: 1 });



export default mongoose.model("User", userSchema);
