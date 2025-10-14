import mongoose from "mongoose";

// donationSchema define karta hai ke donations collection me kya fields hongi
const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  items: [
    {
      foodType: String,
      qtyKg: Number,
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
}
, { timestamps: true }
);

// donation model export
export default mongoose.model("Donation", donationSchema);


