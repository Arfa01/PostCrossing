import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Postcard from "./models/Postcard.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const countries = [
  "USA",
  "Canada",
  "Germany",
  "Pakistan",
  "Japan",
  "Brazil",
  "France",
  "Australia",
  "India",
  "Mexico",
];

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedData = async () => {
  try {
    console.log("🧹 Clearing old data...");
    await User.deleteMany();
    await Postcard.deleteMany();

    console.log("👤 Creating users...");
    const users = [];

    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        username: `user${i}`,
        email: `user${i}@mail.com`,
        country: getRandom(countries),
        avatarUrl: getRandom(avatars),
        bio: "Loves sending postcards 🌍",
      });
      users.push(user);
    }

    console.log("📬 Creating postcards...");
    const postcards = [];

    for (let i = 0; i < 20; i++) {
      const sender = getRandom(users);
      let receiver = getRandom(users);
      while (receiver._id.equals(sender._id)) {
        receiver = getRandom(users); // ensure not self
      }

      const sentAt = new Date(Date.now() - Math.random() * 20 * 86400000); // random days ago
      const isReceived = Math.random() > 0.5;
      const receivedAt = isReceived
        ? new Date(sentAt.getTime() + Math.random() * 10 * 86400000)
        : null;

      const postcard = await Postcard.create({
        postcardCode: `${sender.country.substring(0, 2).toUpperCase()}-${1000000 + i}`,
        sender: sender._id,
        receiver: receiver._id,
        message: `A warm postcard from ${sender.username} to ${receiver.username}`,
        imageUrl: `https://picsum.photos/seed/${i}/600/400`,
        fromCountry: sender.country,
        toCountry: receiver.country,
        status: isReceived ? "received" : "traveling",
        sentAt,
        receivedAt,
      });

      // update user counters
      sender.sentCount += 1;
      receiver.receivedCount += isReceived ? 1 : 0;
      await sender.save();
      await receiver.save();

      postcards.push(postcard);
    }

    console.log(`🌍 Created ${users.length} users and ${postcards.length} postcards`);
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

seedData();
