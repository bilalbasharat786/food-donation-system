// express import — server framework jo routes banane ke liye use hota hai.
import express from "express";

// Distribution model import — ye track karega kis beneficiary ko food distribute hua.
import Distribution from "../models/Distribution.js";

// Store model import — store ke stock ko update karne ke liye.
import Store from "../models/Store.js";

// authMiddleware import (JWT verify karne ke liye)
import authMiddleware from "../middleware/auth.js";

// express ka Router banaya — isme hum distribution related routes define karenge.
const router = express.Router();


// ---------------- ADD DISTRIBUTION ----------------

// POST "/" — ek nayi distribution entry add karne ke liye.
router.post("/", authMiddleware, async (req, res) => {
  try {
    // request body se beneficiaryId, storeId aur items extract kiye.
    const { beneficiaryId, storeId, items } = req.body;

    // naya Distribution object banaya (userId bhi add kiya) aur DB me save kiya.
    const distribution = new Distribution({ beneficiaryId, storeId, items, userId: req.user.id });
    await distribution.save();

    // ab store ka stock update karna hai (subtract karna hai kyunki food distribute ho gaya).
    const store = await Store.findOne({ _id: storeId, userId: req.user.id }); // 🔥 user-specific store

    if (!store) {
      return res.status(404).json({ error: "Store not found for this user" });
    }

    // har distributed item ke liye loop chalaya.
    items.forEach(({ foodType, qtyKg }) => {
      // store ke currentStock me check kiya ke kya ye foodType available hai.
      const stockItem = store.currentStock.find(s => s.foodType === foodType);

      // agar stockItem mila to uski quantity reduce kar di.
      if (stockItem) {
        stockItem.qtyKg -= qtyKg;

        // agar quantity 0 se neeche chali jaye to usko 0 pe fix kar diya (negative stock prevent karne ke liye).
        if (stockItem.qtyKg < 0) stockItem.qtyKg = 0;
      }
    });

    // stock list me se un items ko hata diya jinki quantity 0 ya usse neeche ho gayi hai.
    store.currentStock = store.currentStock.filter(s => s.qtyKg > 0);

    // updated stock ko DB me save kar diya.
    await store.save();

    // success response bheja.
    res.json({ message: "✅ Distribution recorded", distribution });
  } catch (err) {
    // agar error aaya to server error bheja.
    res.status(500).json({ error: err.message });
  }
});


// ---------------- GET ALL DISTRIBUTIONS ----------------

// GET "/" — saare distributions list karne ke liye (sirf current user ke).
router.get("/", authMiddleware, async (req, res) => {
  try {
    // sirf current user ke distributions fetch kiye.
    const distributions = await Distribution.find({ userId: req.user.id })
      .populate("beneficiaryId", "name")
      .populate("storeId", "name");

    // response bheja.
    res.json(distributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// router export kiya — taki index.js me use kiya ja sake.
export default router;
