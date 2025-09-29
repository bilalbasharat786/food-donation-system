// mongoose import — MongoDB ke sath kaam karne ke liye ODM library (schema aur models banane ke liye).
import mongoose from "mongoose";

// beneficiarySchema banaya — ye define karta hai ke "beneficiaries" collection me document ka structure kaisa hoga.
const beneficiarySchema = new mongoose.Schema({

  // type field: String type hoga, required hoga. Sirf "individual" ya "family" hi allow hoga (enum restriction).
  type: { type: String, enum: ["individual", "family"], required: true },

  // name field: String type hoga aur required hoga (har beneficiary ka naam hona chahiye).
  name: { type: String, required: true },

  // contact field: String type hoga aur required hoga (phone ya email ho sakta hai).
  contact: { type: String, required: true },

  // address field: String type hoga (optional rakha hai).
  address: { type: String },

  // householdSize field: Number type hoga. Ye sirf tab relevant hai jab type = "family" ho.
  householdSize: { type: Number },

  // notes field: String type hoga. Extra info ya remarks ke liye use hota hai (optional).
  notes: { type: String },
 // userId field: ye store karega kis user ne donor add kiya.
  // Isse ensure hoga ke har user ka apna data ho.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // createdAt field: Date type hoga. Default value abhi ka current date/time set hoti hai (Date.now).
  createdAt: { type: Date, default: Date.now }

});

// model export kiya — ye mongoose ke through ek "Beneficiary" model banata hai jo DB me "beneficiaries" collection se linked hoga.
// Is model ka use queries me hoga (Beneficiary.create, Beneficiary.find, etc.)
export default mongoose.model("Beneficiary", beneficiarySchema);

