// models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  currency: { type: String, default: "INR" },
  budgetLimit: { type: Number, default: 0 },
  notifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false }
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
