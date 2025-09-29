// express import — server framework jo API routes banane ke liye use hota hai.
import express from "express";

// Beneficiary model import — database me "beneficiaries" collection ke sath kaam karne ke liye.
import Beneficiary from "../models/Beneficiary.js";

// authMiddleware import (JWT verify karne ke liye)
import authMiddleware from "../middleware/auth.js";

// express ka Router banaya — isme hum CRUD routes define karenge.
const router = express.Router();


// ---------------- CREATE BENEFICIARY ----------------

// POST "/" — ek naya beneficiary add karne ke liye.
router.post("/", authMiddleware, async (req, res) => {
  try {
    // request body se data le kar new Beneficiary object banaya.
    // 🔥 isme userId bhi store hoga taki pata chale kis user ne banaya.
    const newBeneficiary = new Beneficiary({
      ...req.body,
      userId: req.user.id,   // 👈 current logged-in user ka id yahan set hota hai
    });

    // DB me save kiya.
    await newBeneficiary.save();

    // success response bheja.
    res.json({ message: "✅ Beneficiary added", beneficiary: newBeneficiary });
  } catch (err) {
    // agar koi error aaya to server error bheja.
    res.status(500).json({ error: err.message });
  }
});


// ---------------- GET ALL BENEFICIARIES ----------------

// GET "/" — current user ke saare beneficiaries list karne ke liye.
router.get("/", authMiddleware, async (req, res) => {
  try {
    // 🔥 sirf wahi beneficiaries fetch karo jinka userId = logged-in user
    const beneficiaries = await Beneficiary.find({ userId: req.user.id });

    // response bheja.
    res.json(beneficiaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- UPDATE BENEFICIARY ----------------

// PUT "/:id" — ek specific beneficiary ko update karne ke liye.
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // 🔥 sirf wahi beneficiary update karo jo current user ka ho
    const updated = await Beneficiary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    // response bheja updated beneficiary ke sath.
    res.json({ message: "✅ Beneficiary updated", beneficiary: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- DELETE BENEFICIARY ----------------

// DELETE "/:id" — ek specific beneficiary ko delete karne ke liye.
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // 🔥 sirf wahi beneficiary delete karo jo current user ka ho
    await Beneficiary.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    // success response bheja.
    res.json({ message: "🗑️ Beneficiary deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// router export kiya — taki index.js me use kiya ja sake.
export default router;
