import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";   // <-- ADD THIS
import User from "../models/User.js";

const router = express.Router();

// ---------------- REGISTER ROUTE ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LOGIN ROUTE ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // ✅ JWT Token generate karo
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "✅ Login successful",
      token,  // 🔥 IMPORTANT
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
