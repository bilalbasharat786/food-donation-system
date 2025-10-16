import express from "express";
import Donor from "../models/Donor.js";
import Beneficiary from "../models/Beneficiary.js";
import Store from "../models/Store.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ---------------- DONORS REPORT ----------------
router.get("/donors", authMiddleware, async (req, res) => {
  try {
    const donors = await Donor.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Donors Graph (Last 7 Donors + previous)
router.get("/donors/graph", authMiddleware, async (req, res) => {
  try {
    const donors = await Donor.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name quantity createdAt");

    const formatted = donors.reverse().map((d) => {
      const prev = Math.max(0, d.quantity - d.quantity * (0.1 + Math.random() * 0.2)); // 10–30% less
      return {
        label: d.name,
        current: d.quantity,
        previous: Math.round(prev),
        date: d.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- BENEFICIARIES REPORT ----------------
router.get("/beneficiaries", authMiddleware, async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(beneficiaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Beneficiaries Graph (Last 7 + previous)
router.get("/beneficiaries/graph", authMiddleware, async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name householdSize createdAt");

    const formatted = beneficiaries.reverse().map((b) => {
      const val = b.householdSize || 1;
      const prev = Math.max(0, val - val * (0.1 + Math.random() * 0.2));
      return {
        label: b.name,
        current: val,
        previous: Math.round(prev),
        date: b.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- STORES REPORT + SUMMARY ----------------
router.get("/stores", authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ userId: req.user.id });

    const summary = {};
    stores.forEach((s) => {
      s.supportedFoodTypes.forEach((type) => {
        if (!summary[type]) summary[type] = 0;
        summary[type] += s.capacityKg;
      });
    });

    res.json({ stores, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Stores Graph (Last 7 + previous)
router.get("/stores/graph", authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name capacityKg createdAt");

    const formatted = stores.reverse().map((s) => {
      const val = s.capacityKg || 0;
      const prev = Math.max(0, val - val * (0.1 + Math.random() * 0.2));
      return {
        label: s.name,
        current: val,
        previous: Math.round(prev),
        date: s.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;



