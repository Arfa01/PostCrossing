import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Postcard from "./models/Postcard.js";
import SendRequest from "./models/SendRequest.js";
import UserStats from "./models/UserStats.js";

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🧹 Cleaning all collections...");

    await Promise.all([
      User.deleteMany({}),
      Postcard.deleteMany({}),
      SendRequest.deleteMany({}),
      UserStats.deleteMany({}),
    ]);

    console.log("✅ All collections cleared successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error cleaning data:", err);
    process.exit(1);
  }
};

cleanup();
