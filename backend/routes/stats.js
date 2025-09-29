import express from "express";
import Donor from "../models/Donor.js";
import Beneficiary from "../models/Beneficiary.js";
import Store from "../models/Store.js";
import Donation from "../models/Donation.js";
import Distribution from "../models/Distribution.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const donorsCount = await Donor.countDocuments({ userId });
    const beneficiariesCount = await Beneficiary.countDocuments({ userId });
    const storesCount = await Store.countDocuments({ userId });
    const donationsCount = await Donation.countDocuments({ userId });
    const distributionsCount = await Distribution.countDocuments({ userId });

    res.json({
      donors: donorsCount,
      beneficiaries: beneficiariesCount,
      stores: storesCount,
      donations: donationsCount,
      distributions: distributionsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
