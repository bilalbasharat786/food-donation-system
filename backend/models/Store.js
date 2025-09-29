// mongoose import — MongoDB ke sath kaam karne ke liye ODM library (schemas aur models banane ke liye).
import mongoose from "mongoose";

// storeSchema banaya — ye define karta hai ke "stores" collection me ek document kaise hoga.
const storeSchema = new mongoose.Schema({

  // name field: String type hoga aur required hoga.
  // Matlab har store ka ek naam dena zaroori hai (ex: Main Store, City Branch).
  name: { type: String, required: true },

  // location field: String type hoga aur required hoga.
  // Matlab har store ka address/location dena mandatory hai.
  location: { type: String, required: true },

  // capacityKg field: Number type hoga aur required hoga.
  // Matlab store ki maximum storage capacity (kg me) define hoti hai.
  capacityKg: { type: Number, required: true },

  // supportedFoodTypes field: ek array of strings hoga.
  // Example: ["Cooked", "Grains", "Fruits"] → matlab store kin food categories ko support karta hai.
  supportedFoodTypes: [{ type: String }],

  // currentStock field: ek array hoga jisme har item ka foodType aur qtyKg hoga.
  // Matlab abhi store ke andar kaunsa food aur kitni quantity (kg) available hai.
  currentStock: [
    {
      foodType: String,
      qtyKg: Number
    }
  ],
  // 🔥 userId add kiya — taaki har store ek user ke sath linked ho
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // createdAt field: Date type hoga aur default abhi ka current time hoga.
  // Matlab store entry kab create hui uska time automatically save hoga.
  createdAt: { type: Date, default: Date.now }

});

// model export kiya — ye mongoose ke through ek "Store" model banata hai jo DB me "stores" collection se linked hoga.
// Is model ka use queries me hoga (Store.create, Store.find, Store.updateOne, etc.)
export default mongoose.model("Store", storeSchema);

