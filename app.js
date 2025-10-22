import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import postcardRoutes from "./routes/postcardRoutes.js";
import sendRequestRoutes from "./routes/sendRequestRoutes.js";
import userStatsRoutes from "./routes/userStatsRoutes.js";




dotenv.config();

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // these options are no longer needed but safe to keep
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Default route
app.get("/", (req, res) => {
  res.send("🌍 Postcrossing API is live!");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/postcards", postcardRoutes);
app.use("/api/send_requests", sendRequestRoutes);
app.use("/api/userstats", userStatsRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
