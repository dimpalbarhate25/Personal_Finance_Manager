// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent model overwrite if reloaded
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
