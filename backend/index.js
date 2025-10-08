// ---------------- IMPORTS ----------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes import
import authRoutes from "./routes/auth.js";
import donorRoutes from "./routes/donor.js";
import beneficiaryRoutes from "./routes/beneficiary.js";
import storeRoutes from "./routes/store.js";
import reportRoutes from "./routes/reports.js";
import donationRoutes from "./routes/donation.js";
import distributionRoutes from "./routes/distribution.js";
import statsRoutes from "./routes/stats.js";

// ---------------- APP CREATION ----------------
dotenv.config();
const app = express();

// ---------------- MIDDLEWARES ----------------
app.use(express.json());

// ✅ FIXED: Proper CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173", // local frontend (for development)
    "https://food-donation-systm.netlify.app/", // deployed frontend domain (change if yours is different)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/distributions", distributionRoutes);
app.use("/api/stats", statsRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("✅ Food Donation System Backend Running...");
});

// ---------------- DB CONNECTION + SERVER START ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // ✅ Use process.env.PORT (for Vercel) or 5000 locally
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log("❌ DB Error:", err));


