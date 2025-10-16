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
import userRoutes from "./routes/profile.js";

dotenv.config();
const app = express();

// ---------------- MIDDLEWARES ----------------
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "http://localhost:3000",
  "https://food-donation-systm.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.options("*", cors());


// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/distributions", distributionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/profile", userRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("✅ Food Donation System Backend Running...");
});

// ---------------- DB CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.log("❌ DB Error:", err));



