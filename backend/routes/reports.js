// express import — routes banane ke liye use hota hai
import express from "express";

// Models import — donors, beneficiaries, stores ke data fetch karne ke liye
import Donor from "../models/Donor.js";
import Beneficiary from "../models/Beneficiary.js";
import Store from "../models/Store.js";

// authMiddleware import — token verify aur user extract karne ke liye
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// ---------------- DONORS REPORT ----------------
router.get("/donors", authMiddleware, async (req, res) => {
  try {
    // sirf current user ke donors
    const donors = await Donor.find({ userId: req.user.id });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- BENEFICIARIES REPORT ----------------
router.get("/beneficiaries", authMiddleware, async (req, res) => {
  try {
    // sirf current user ke beneficiaries
    const beneficiaries = await Beneficiary.find({ userId: req.user.id });
    res.json(beneficiaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- STORES REPORT + SUMMARY ----------------
router.get("/stores", authMiddleware, async (req, res) => {
  try {
    // sirf current user ke stores
    const stores = await Store.find({ userId: req.user.id });

    // summary object banaya — supportedFoodTypes ko group karke
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

export default router;


