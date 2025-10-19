import express from "express";
import Postcard from "../models/Postcard.js";
import User from "../models/User.js";
import UserStats from "../models/UserStats.js";

const router = express.Router();

// Send a postcard
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, message, imageUrl, fromCountry, toCountry } = req.body;

    const postcardCode = `${fromCountry.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 10000000)}`;

    const newCard = new Postcard({
      postcardCode,
      sender: senderId,
      receiver: receiverId,
      message,
      imageUrl,
      fromCountry,
      toCountry,
      status: "traveling",
    });

    const savedCard = await newCard.save();

    // Update sender stats
    await UserStats.findOneAndUpdate(
      { user: senderId },
      { $inc: { totalSent: 1 }, $addToSet: { countriesSentTo: toCountry } }
    );

    res.status(201).json(savedCard);
  } catch (err) {
    res.status(500).json({ message: "Error sending postcard", error: err.message });
  }
});

// Get all traveling postcards for a user
router.get('/traveling/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const travelingPostcards = await Postcard.find({
      sender: userId,
      status: "traveling"
    }).populate("receiver", "username country");

    res.status(200).json({
      count: travelingPostcards.length,
      travelingPostcards
    });
  } catch (error) {
    console.error("Error fetching traveling postcards:", error);
    res.status(500).json({ message: "Error fetching traveling postcards", error });
  }
});

// Get all received postcards for a user
router.get('/received/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const receivedPostcards = await Postcard.find({
      receiver: userId,
      status: "received"
    }).populate("sender", "username country");

    res.status(200).json({
      count: receivedPostcards.length,
      receivedPostcards
    });
  } catch (error) {
    console.error("Error fetching received postcards:", error);
    res.status(500).json({ message: "Error fetching received postcards", error });
  }
});


// Receive postcard
router.post("/receive/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // 1. Find the postcard
    const postcard = await Postcard.findById(postId).populate(["sender", "receiver"]);
    if (!postcard) {
      return res.status(404).json({ message: "Postcard not found." });
    }

    // 2. Update its status to 'received'
    postcard.status = "received";
    postcard.receivedAt = new Date();
    await postcard.save();

    // 3. Update sender and receiver stats
    await UserStats.updateOne(
      { user: postcard.sender._id },
      { $inc: { totalSent: 1 } },
      { upsert: true }
    );
    await UserStats.updateOne(
      { user: postcard.receiver._id },
      { $inc: { totalReceived: 1 } },
      { upsert: true }
    );

    // 4. Pick a random eligible sender
    const eligibleSenders = await User.find({ _id: { $ne: postcard.sender._id } });
    if (eligibleSenders.length === 0) {
      return res.status(400).json({ message: "No eligible users to send reciprocal postcard." });
    }

    const randomSender = eligibleSenders[Math.floor(Math.random() * eligibleSenders.length)];

    // 5. Create reciprocal postcard
    const reciprocalCode = `${randomSender.country.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 10000000)}`;
    const reciprocalCard = new Postcard({
      postcardCode: reciprocalCode,
      sender: randomSender._id,
      receiver: postcard.sender._id,
      message: `A reciprocal postcard to ${postcard.sender.username}!`,
      imageUrl: "https://placehold.co/600x400?text=Reciprocal+Postcard",
      fromCountry: randomSender.country,
      toCountry: postcard.sender.country,
      status: "traveling",
    });
    await reciprocalCard.save();

    // 6. Respond
    res.status(200).json({
      message: "Postcard received successfully, reciprocal card sent!",
      receivedPostcard: postcard,
      reciprocalPostcard: reciprocalCard,
    });
  } catch (error) {
    console.error("Error receiving postcard:", error);
    res.status(500).json({ message: "Error receiving postcard", error: error.message });
  }
});

// Get stats for a user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const sent = await Postcard.countDocuments({ sender: userId });
    const received = await Postcard.countDocuments({ receiver: userId, status: "received" });
    const traveling = await Postcard.countDocuments({ sender: userId, status: "traveling" });

    res.status(200).json({
      userId,
      totalSent: sent,
      totalReceived: received,
      totalTraveling: traveling
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching user stats", error });
  }
});

export default router;
