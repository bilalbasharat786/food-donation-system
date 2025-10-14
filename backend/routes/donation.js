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

// ---------------- 📊 GET DONATION STATS FOR GRAPH ----------------
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Get last 7 days' donation data (based on createdAt)
    const data = await Donation.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalKg: { $sum: "$items.qtyKg" },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 },
      },
      { $limit: 7 },
    ]);

    // ✅ Format for frontend (e.g. Mon, Tue, etc.)
    const formatted = data
      .filter((d) => d._id && d._id.day && d._id.month)
      .map((d) => {
        const dateObj = new Date(d._id.year, d._id.month - 1, d._id.day);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" }); // e.g. Mon
        return {
          date: dayName,
          totalKg: d.totalKg,
        };
      })
      .reverse();

    res.json(formatted);
  } catch (err) {
    console.error("Error in /api/donations/stats:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;


