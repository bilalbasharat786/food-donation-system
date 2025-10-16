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
    // Last 14 donors: 7 current + 7 previous
    const donors = await Donor.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(14)
      .select("name quantity createdAt");

    // Split last 7 (current) aur usse pehle 7 (previous)
    const current = donors.slice(0, 7).reverse();
    const previous = donors.slice(7, 14).reverse();

    // Combine by index
    const formatted = current.map((d, i) => ({
      label: d.name,
      current: d.quantity,
      previous: previous[i]?.quantity || 0,
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

// ✅ Beneficiaries Graph (Last 7 + previous)
router.get("/beneficiaries/graph", authMiddleware, async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(14)
      .select("name householdSize createdAt");

    const current = beneficiaries.slice(0, 7).reverse();
    const previous = beneficiaries.slice(7, 14).reverse();

    const formatted = current.map((b, i) => ({
      label: b.name,
      current: b.householdSize || 1,
      previous: previous[i]?.householdSize || 0,
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

// ✅ Stores Graph (Last 7 + previous)
router.get("/stores/graph", authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(14)
      .select("name capacityKg createdAt");

    const current = stores.slice(0, 7).reverse();
    const previous = stores.slice(7, 14).reverse();

    const formatted = current.map((s, i) => ({
      label: s.name,
      current: s.capacityKg || 0,
      previous: previous[i]?.capacityKg || 0,
      date: s.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;



