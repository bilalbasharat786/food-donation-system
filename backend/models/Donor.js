// mongoose import — MongoDB ke sath kaam karne ke liye ODM library (schemas aur models banane ke liye). 
import mongoose from "mongoose";

// donorSchema banaya — ye define karta hai ke "donors" collection me ek document kaise hoga.
const donorSchema = new mongoose.Schema({

  // name field: String type hoga aur required hoga.
  name: { type: String, required: true },

  // contact field: String type hoga aur required hoga.
  contact: { type: String, required: true },

  // address field: String type hoga, optional hai.
  address: { type: String },

  // foodType field: String type hoga aur required hoga.
  foodType: { type: String, required: true },

  // quantity field: Number type hoga aur required hoga.
  quantity: { type: Number, required: true },

  // userId field: ye store karega kis user ne donor add kiya.
  // Isse ensure hoga ke har user ka apna data ho.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // createdAt field: Date type hoga, default value abhi ka current time hoga.
  createdAt: { type: Date, default: Date.now }
});

// model export kiya
export default mongoose.model("Donor", donorSchema);

