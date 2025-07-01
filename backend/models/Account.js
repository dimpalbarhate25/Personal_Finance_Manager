import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🔁 link to users collection
    required: true,
  },
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number,required: true, default: 0 },
  icon: { type: String },
});

const Account = mongoose.model("Account", accountSchema);
export default Account;
