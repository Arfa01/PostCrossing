import express from "express";
import User from "../models/User.js";
import UserStats from "../models/UserStats.js";

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
  try {
    const { username, email, country, address, avatarUrl, bio } = req.body;
    const newUser = new User({ username, email, country, address, avatarUrl, bio });
    const savedUser = await newUser.save();

    // Create initial stats for user
    const stats = new UserStats({ user: savedUser._id });
    await stats.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
});





// utility GET (gets all users with stats populated, for debugging)
router.get("/debug/all", async (req, res) => {
  try {
    const users = await User.find().lean();
    const stats = await UserStats.find().populate("user", "username email country").lean();

    res.status(200).json({
      usersCount: users.length,
      statsCount: stats.length,
      users,
      stats,
    });
  } catch (error) {
    console.error("Error fetching debug users:", error);
    res.status(500).json({ message: "Error fetching debug users", error });
  }
});


export default router;
