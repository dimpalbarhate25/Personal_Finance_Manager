import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profession: { type: String, required: true }, // ✅ new field
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
