import express from "express";
import Donation from "../models/Donation.js";
import Store from "../models/Store.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ---------------- ADD DONATION ----------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { donorId, storeId, items } = req.body;
    const donation = new Donation({ donorId, storeId, items, userId: req.user.id });
    await donation.save();

    const store = await Store.findOne({ _id: storeId, userId: req.user.id });

    if (!store) {
      return res.status(404).json({ error: "Store not found for this user" });
    }

    items.forEach(({ foodType, qtyKg }) => {
      const stockItem = store.currentStock.find((s) => s.foodType === foodType);
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

// ---------------- 📊 NEW: GET DONATION STATS FOR GRAPH ----------------
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // aggregation: last 7 days ka total quantity per day
    const data = await Donation.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalKg: { $sum: { $sum: "$items.qtyKg" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
      { $limit: 7 },
    ]);

    // format result for frontend
    const formatted = data.map((d) => ({
      date: `${d._id.day}/${d._id.month}`,
      totalKg: d.totalKg,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

