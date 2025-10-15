// mongoose import — MongoDB ke saath kaam karne ke liye ODM
import mongoose from "mongoose";

// UserSchema banaya — user document ka structure define
const userSchema = new mongoose.Schema({
  // name required string
  name: { type: String, required: true },

  // email required + unique (duplicate allow nahi)
  email: { type: String, required: true, unique: true },

  // password required
  password: { type: String, required: true },
  // contact optional
  // contact: { type: String },
});

// Model export — baad me queries me use hoga (User.findOne, User.create)
export default mongoose.model("User", userSchema);

