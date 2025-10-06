// express import — server banane ke liye use hota hai
import express from "express";

// mongoose import — MongoDB ke saath connect karne ke liye
import mongoose from "mongoose";

// cors import — frontend aur backend ke beech communication allow karne ke liye
import cors from "cors";

// dotenv import — .env file se environment variables (jaise DB URI, JWT secret) load karne ke liye
import dotenv from "dotenv";

// Saare routes import kiye — alag-alag functionality ke liye
import authRoutes from "./routes/auth.js";               // login/register
import donorRoutes from "./routes/donor.js";             // donors CRUD
import beneficiaryRoutes from "./routes/beneficiary.js"; // beneficiaries CRUD
import storeRoutes from "./routes/store.js";             // stores CRUD
import reportRoutes from "./routes/reports.js";          // reports module
import donationRoutes from "./routes/donation.js";       // donations
import distributionRoutes from "./routes/distribution.js"; // distributions
import statsRoutes from "./routes/stats.js";          // stats module


// ---------------- APP CREATION ----------------

// dotenv config call — env variables load ho gaye
dotenv.config();

// express app banaya
const app = express();


// ---------------- MIDDLEWARES ----------------

// cors enable kiya — taki frontend (React) easily backend ke saath connect ho
app.use(cors());

// JSON parser — request body ko JSON me parse karta hai
app.use(express.json());


// ---------------- ROUTES USE ----------------

// auth ke saare routes "/api/auth" pe chalein
app.use("/api/auth", authRoutes);

// donors ke routes "/api/donors"
app.use("/api/donors", donorRoutes);

// beneficiaries ke routes "/api/beneficiaries"
app.use("/api/beneficiaries", beneficiaryRoutes);

// stores ke routes "/api/stores"
app.use("/api/stores", storeRoutes);

// reports ke routes "/api/reports"
app.use("/api/reports", reportRoutes);

// donations ke routes "/api/donations"
app.use("/api/donations", donationRoutes);

// distributions ke routes "/api/distributions"
app.use("/api/distributions", distributionRoutes);

// stats ke routes "/api/stats"
app.use("/api/stats", statsRoutes);


// ---------------- TEST ROUTE ----------------

// agar koi user sirf "/" pe aaye to test message mile
app.get("/", (req, res) => {
  res.send("Food Donation System Backend Running...");
});


// ---------------- DB CONNECTION + SERVER START ----------------

// mongoose se MongoDB connect kiya (env file me se MONGO_URI liya)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // agar DB connect ho gaya to console me success message
    console.log("✅ MongoDB Connected");

    // server ko port 5000 pe run karaya
    app.listen(5000, () => console.log("🚀 Server running at 5000"));
  })
  .catch(err => console.log("DB Error:", err));
