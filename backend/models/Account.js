// ✅ Use ES module import
import mongoose from "mongoose";

// Define the schema
const accountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: String,
  type: String,
  balance: Number,
  icon: String,
});

// ✅ Export using ES module syntax
const Account = mongoose.model("Account", accountSchema);
export default Account;
