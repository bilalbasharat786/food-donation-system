import express from "express";
import Store from "../models/Store.js";
import authMiddleware from "../middleware/auth.js"; // 🔥 auth import

const router = express.Router();

// ---------------- CREATE STORE ----------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newStore = new Store({
      ...req.body,
      userId: req.user.id // 🔥 logged-in user ke sath link
    });

    await newStore.save();
    res.json({ message: "✅ Store added successfully", store: newStore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ALL STORES ----------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ userId: req.user.id }); // 🔥 sirf usi user ke stores
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- UPDATE STORE ----------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedStore = await Store.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // 🔥 userId check
      req.body,
      { new: true }
    );
    res.json({ message: "✅ Store updated", store: updatedStore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE STORE ----------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Store.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // 🔥 userId check
    res.json({ message: "🗑️ Store deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
