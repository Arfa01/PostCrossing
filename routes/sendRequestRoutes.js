import express from "express";
import SendRequest from "../models/SendRequest.js";
import ReceiveQueue from "../models/ReceiveQueue.js";
import User from "../models/User.js";
import Postcard from "../models/Postcard.js";
import UserStats from "../models/UserStats.js";


const router = express.Router();

/**
 * Helper: pick a random eligible recipient (not the requester).
 * You can add more eligibility rules (not same country, rate limits, etc.)
 */
async function pickRandomEligibleRecipient(excludeUserId) {
  // Basic approach: count eligible users, pick random skip
  const filter = { _id: { $ne: excludeUserId } };
  const count = await User.countDocuments(filter);
  if (count === 0) return null;
  // random skip
  const rand = Math.floor(Math.random() * count);
  const doc = await User.findOne(filter).skip(rand).lean();
  return doc;
}

/**
 * POST /api/send_requests
 * Body: { requesterId: "<userId>" }
 *
 * Flow:
 * 1) Try to pop oldest waiting recipient from ReceiveQueue that is not the requester.
 * 2) If found -> assignedRecipient = that user.
 *    Else -> pick a random eligible recipient from users collection.
 * 3) Create SendRequest with assignedRecipient, and push requester into ReceiveQueue.
 * 4) Return assignedRecipient info (addressSnapshot optional).
 */

router.post("/", async (req, res) => {
  try {
    const { requesterId } = req.body;

    // 1️⃣ Find all users except the requester
    const eligibleUsers = await User.find({ _id: { $ne: requesterId } });

    if (eligibleUsers.length === 0)
      return res.status(404).json({ message: "No eligible recipients available." });

    // 2️⃣ Pick a random recipient
    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
    const assignedRecipient = eligibleUsers[randomIndex];

    // 3️⃣ Create a new SendRequest
    const newRequest = new SendRequest({
      requester: requesterId,
      assignedRecipient: assignedRecipient._id,
      status: "assigned",
    });
    await newRequest.save();

    // 4️⃣ Create a new Postcard document automatically
    const sender = await User.findById(requesterId);
    const fromCountry = sender.country;
    const toCountry = assignedRecipient.country;

    const postcardCode = `${fromCountry.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 10000000)}`;

    const newPostcard = new Postcard({
      postcardCode,
      sender: requesterId,
      receiver: assignedRecipient._id,
      fromCountry,
      toCountry,
      message: `A friendly postcard from ${sender.username} to ${assignedRecipient.username}!`,
      imageUrl: "https://placehold.co/600x400?text=Postcard", // placeholder
      status: "traveling",
    });
    await newPostcard.save();

    // 5️⃣ Update sender’s UserStats
    await UserStats.findOneAndUpdate(
      { user: requesterId },
      { $inc: { totalSent: 1 }, $addToSet: { countriesSentTo: toCountry } }
    );

    // 6️⃣ Respond back with full details
    res.status(201).json({
      message: "Postcard successfully created and assigned!",
      sendRequestId: newRequest._id,
      postcard: newPostcard,
      assignedRecipient: {
        _id: assignedRecipient._id,
        username: assignedRecipient.username,
        country: assignedRecipient.country,
        addressSnapshot: assignedRecipient.addressSnapshot,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating send request", error: err.message });
  }
});



// Utility GET (gets all send requests for debugging, confirms send requests were created and linked)
router.get("/debug/all", async (req, res) => {
  try {
    const requests = await SendRequest.find()
      .populate("requester", "username country")
      .populate("assignedRecipient", "username country")
      .lean();

    res.status(200).json({
      total: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching all send requests:", error);
    res.status(500).json({ message: "Error fetching send requests", error });
  }
});


export default router;
