import express from "express";
import Donation from "../models/Donation.js";
import Store from "../models/Store.js";
import authMiddleware from "../middleware/auth.js"; // 🔥 auth import

const router = express.Router();

// ---------------- ADD DONATION ----------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { donorId, storeId, items } = req.body;

    // 🔥 userId save karo
    const donation = new Donation({ donorId, storeId, items, userId: req.user.id });
    await donation.save();

    // Store ka stock update karo
    const store = await Store.findOne({ _id: storeId, userId: req.user.id }); // 🔥 user-specific store

    if (!store) {
      return res.status(404).json({ error: "Store not found for this user" });
    }

    items.forEach(({ foodType, qtyKg }) => {
      const stockItem = store.currentStock.find(s => s.foodType === foodType);
      if (stockItem) {
        stockItem.qtyKg += qtyKg;
      } else {
        store.currentStock.push({ foodType, qtyKg });
      }
    });

    await store.save();

    res.json({ message: "✅ Donation recorded", donation });
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

export default router;
