// mongoose import — MongoDB ke sath kaam karne ke liye ODM library (schema aur models define karne ke liye).
import mongoose from "mongoose";

// donationSchema banaya — ye define karta hai ke "donations" collection me document kaise hoga.
const donationSchema = new mongoose.Schema({

  // donorId: ye ek reference hai "Donor" model ke _id ka.
  // Matlab ye donation kis donor ne diya hai.
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },

  // storeId: ye ek reference hai "Store" model ke _id ka.
  // Matlab donation kis store me save kiya gaya hai.
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

  // items: ek array hoga jisme multiple food items store ho sakte hain.
  // Har item me foodType (string) aur qtyKg (number) hoga.
  items: [
    {
      foodType: String,
      qtyKg: Number
    }
  ],
  // 🔥 userId: har donation kis user ka hai
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // date: donation ka date record karega.
  // Default value abhi ka current date/time hoga (Date.now).
  date: { type: Date, default: Date.now }

});

// model export kiya — ye mongoose ke through ek "Donation" model banata hai jo DB me "donations" collection se linked hoga.
// Is model ka use queries me hoga (Donation.create, Donation.find, etc.)
export default mongoose.model("Donation", donationSchema);

