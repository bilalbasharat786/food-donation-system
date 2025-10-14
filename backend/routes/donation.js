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

// ---------------- 📊 GET TODAY'S DONATION STATS ----------------
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // aaj ki date ke start & end nikal lo
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // aaj ke din ke donations lo
    const todayDonations = await Donation.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // total quantity sum karo
    let totalKg = 0;
    todayDonations.forEach((don) => {
      don.items.forEach((i) => {
        totalKg += i.qtyKg;
      });
    });

    // frontend ke liye ek simple array bhejo (chart ke format me)
    const response = [
      {
        date: new Date().toLocaleDateString("en-GB"), // e.g. 14/10/2025
        totalKg,
      },
    ];

    res.json(response);
  } catch (err) {
    console.error("Error fetching today's stats:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;


