import express from "express";
import Postcard from "../models/Postcard.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * 📊 Route: GET /api/userstats/
 * Description: Generate and return live stats per user
 */
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Fetch all postcards
    const postcards = await Postcard.find()
      .populate("sender", "username country")
      .populate("receiver", "username country")
      .lean();

    // 2️⃣ Create a stats map per user
    const statsMap = {};

    postcards.forEach((pc) => {
      // Handle sender
      if (pc.sender) {
        const sid = pc.sender._id.toString();
        if (!statsMap[sid]) {
          statsMap[sid] = {
            username: pc.sender.username,
            country: pc.sender.country,
            totalSent: 0,
            totalReceived: 0,
            countriesSentTo: new Set(),
            countriesReceivedFrom: new Set(),
            travelDays: [],
          };
        }

        statsMap[sid].totalSent++;
        if (pc.toCountry) statsMap[sid].countriesSentTo.add(pc.toCountry);
      }

      // Handle receiver
      if (pc.receiver) {
        const rid = pc.receiver._id.toString();
        if (!statsMap[rid]) {
          statsMap[rid] = {
            username: pc.receiver.username,
            country: pc.receiver.country,
            totalSent: 0,
            totalReceived: 0,
            countriesSentTo: new Set(),
            countriesReceivedFrom: new Set(),
            travelDays: [],
          };
        }

        statsMap[rid].totalReceived++;
        if (pc.fromCountry) statsMap[rid].countriesReceivedFrom.add(pc.fromCountry);
      }

      // Add travel days if received
      if (pc.sentAt && pc.receivedAt) {
        const days =
          (new Date(pc.receivedAt) - new Date(pc.sentAt)) /
          (1000 * 60 * 60 * 24);
        const sid = pc.sender?._id?.toString();
        if (sid && statsMap[sid]) statsMap[sid].travelDays.push(days);
      }
    });

    // 3️⃣ Convert sets → arrays & compute average travel days
    const userStats = Object.entries(statsMap).map(([userId, data]) => ({
      userId,
      username: data.username,
      country: data.country,
      totalSent: data.totalSent,
      totalReceived: data.totalReceived,
      countriesSentTo: Array.from(data.countriesSentTo),
      countriesReceivedFrom: Array.from(data.countriesReceivedFrom),
      averageTravelDays:
        data.travelDays.length > 0
          ? (data.travelDays.reduce((a, b) => a + b, 0) /
              data.travelDays.length).toFixed(1)
          : null,
    }));

    res.status(200).json({
      totalUsers: userStats.length,
      userStats,
    });
  } catch (error) {
    console.error("Error computing user stats:", error);
    res.status(500).json({ message: "Error computing user stats", error });
  }
});

/**
 * 🌍 Route: GET /api/userstats/global
 * Description: Aggregated global stats across all users
 */
router.get("/global", async (req, res) => {
  try {
    const totalPostcards = await Postcard.countDocuments();
    const totalUsers = await User.countDocuments();
    const travelingCount = await Postcard.countDocuments({ status: "traveling" });
    const receivedCount = await Postcard.countDocuments({ status: "received" });

    res.status(200).json({
      totalUsers,
      totalPostcards,
      travelingCount,
      receivedCount,
    });
  } catch (error) {
    console.error("Error computing global stats:", error);
    res.status(500).json({ message: "Error computing global stats", error });
  }
});

export default router;
