import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Get Profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// ✅ Update Profile (name, email, password)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Update name/email
    if (name) user.name = name;
    if (email) user.email = email;

    // ✅ Change password (if provided)
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(403).json({ error: "Incorrect current password" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Profile update failed" });
  }
});

export default router;




