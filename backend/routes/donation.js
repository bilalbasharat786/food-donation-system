// ---------------- IMPORTS ----------------
import express from "express";
import mongoose from "mongoose"; // ✅ FIXED: required for ObjectId
import Donation from "../models/Donation.js";
import Store from "../models/Store.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ---------------- ADD DONATION ----------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { donorId, storeId, items } = req.body;

    // ✅ Save donation with logged-in user's ID
    const donation = new Donation({ donorId, storeId, items, userId: req.user.id });
    await donation.save();

    // ✅ Update Store stock for the same user
    const store = await Store.findOne({ _id: storeId, userId: req.user.id });

    if (!store) {
      return res.status(404).json({ error: "Store not found for this user" });
    }

    // 🔁 Update store stock based on donated items
    items.forEach(({ foodType, qtyKg }) => {
      const stockItem = store.currentStock.find((s) => s.foodType === foodType);
      if (stockItem) {
        stockItem.qtyKg += qtyKg;
      } else {
        store.currentStock.push({ foodType, qtyKg });
      }
    });

    await store.save();

    res.json({ message: "✅ Donation recorded successfully", donation });
  } catch (err) {
    console.error("Error adding donation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ALL DONATIONS ----------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id })
      .populate("donorId", "name")
      .populate("storeId", "name");

    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: err.message });
  }
});
// ---------------- 📊 GET LAST 7 HOURS DONATION STATS ----------------
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // ⏰ Last 7 hours ka range
    const now = new Date();
    const sevenHoursAgo = new Date(now.getTime() - 7 * 60 * 60 * 1000);

    // ✅ Donation data for last 7 hours (using createdAt)
    const recentDonations = await Donation.find({
      userId,
      createdAt: { $gte: sevenHoursAgo, $lte: now },
    }).select("createdAt items -_id");

    // 🧮 Flatten and calculate totalKg per donation
    const formatted = recentDonations.map((don) => {
      const totalKg = don.items.reduce((sum, i) => sum + (i.qtyKg || 0), 0);
      return { createdAt: don.createdAt, totalKg };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching hourly stats:", err);
    res.status(500).json({ error: err.message });
  }
});


 


export default router;


