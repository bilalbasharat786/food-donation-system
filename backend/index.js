import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import donorRoutes from "./routes/donor.js";
import beneficiaryRoutes from "./routes/beneficiary.js";
import storeRoutes from "./routes/store.js";
import reportRoutes from "./routes/reports.js";
import donationRoutes from "./routes/donation.js";
import distributionRoutes from "./routes/distribution.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://food-donation-system-sigma.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/distributions", distributionRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("✅ Food Donation System Backend Running...");
});

// ✅ Mongoose connect (only once)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ✅ Important for Vercel — export the app instead of listen()
export default app;

