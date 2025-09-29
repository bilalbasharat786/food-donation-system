// express import
import express from "express";

// Donor model import
import Donor from "../models/Donor.js";

// authMiddleware import (JWT verify karne ke liye)
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// ---------------- CREATE DONOR ----------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    // naya donor current logged-in user ke sath link karte hue banaya
    const newDonor = new Donor({
      ...req.body,
      userId: req.user.id
    });

    await newDonor.save();

    res.json({ message: "✅ Donor added successfully", donor: newDonor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- GET ALL DONORS (user-specific) ----------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    // sirf current user ke donors fetch kiye
    const donors = await Donor.find({ userId: req.user.id });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- UPDATE DONOR ----------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // sirf wahi donor update hoga jo current user ka ho
    const updatedDonor = await Donor.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json({ message: "✅ Donor updated", donor: updatedDonor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- DELETE DONOR ----------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // sirf wahi donor delete hoga jo current user ka ho
    await Donor.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    res.json({ message: "🗑️ Donor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

