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

    // ✅ Aggregate donations by day (last 7 entries)
    const data = await Donation.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$items", // ✅ important: split items array
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // use createdAt for accurate timestamp
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalKg: { $sum: "$items.qtyKg" }, // sum of all qtyKg per day
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
      { $limit: 7 },
    ]);

    // ✅ Format response for frontend chart
    const formatted = data
    
      .map((d) => ({
        date: `${d._id.day}/${d._id.month}`,
        totalKg: d.totalKg,
      }))
      .reverse(); // reverse so days are in correct order

    res.json(formatted);
  } catch (err) {
    console.error("Error in /api/donations/stats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;


