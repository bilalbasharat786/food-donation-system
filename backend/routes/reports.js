// express import
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

// ✅ NEW: Donors Graph (Last 7 Donors)
router.get("/donors/graph", authMiddleware, async (req, res) => {
  try {
    const donors = await Donor.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name quantity createdAt");

    const formatted = donors.reverse().map((d) => ({
      label: d.name,
      value: d.quantity,
      date: d.createdAt,
    }));

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

// ✅ NEW: Beneficiaries Graph (Last 7)
router.get("/beneficiaries/graph", authMiddleware, async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name householdSize createdAt");

    const formatted = beneficiaries.reverse().map((b) => ({
      label: b.name,
      value: b.householdSize || 1,
      date: b.createdAt,
    }));

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

// ✅ NEW: Stores Graph (Last 7)
router.get("/stores/graph", authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name capacityKg createdAt");

    const formatted = stores.reverse().map((s) => ({
      label: s.name,
      value: s.capacityKg,
      date: s.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


