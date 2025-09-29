// mongoose import — MongoDB ke sath kaam karne ke liye ODM library (schema aur models define karne ke liye).
import mongoose from "mongoose";

// distributionSchema banaya — ye define karta hai ke "distributions" collection me document kaise hoga.
const distributionSchema = new mongoose.Schema({

  // beneficiaryId: ye field ek reference rakhta hai "Beneficiary" model ke _id ke sath.
  // Matlab is distribution ka record kis beneficiary (individual/family) ko mila hai.
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: "Beneficiary", required: true },

  // storeId: ye field ek reference rakhta hai "Store" model ke _id ke sath.
  // Matlab distribution kis store se kiya gaya hai.
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

  // items: ek array hoga jisme multiple food items store ho sakte hain.
  // Har item me foodType (string) aur qtyKg (number) hoga.
  items: [
    {
      foodType: String,
      qtyKg: Number
    }
  ],

  // 🔥 userId: ye field har distribution ko us user se link karegi jisne ye add kiya hai.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // date: distribution ka date record karega.
  // Default value abhi ka current date/time hoga (Date.now).
  date: { type: Date, default: Date.now }

});

// model export kiya — ye mongoose ke through ek "Distribution" model banata hai jo DB me "distributions" collection se linked hoga.
// Is model ka use queries me hoga (Distribution.create, Distribution.find, etc.)
export default mongoose.model("Distribution", distributionSchema);


