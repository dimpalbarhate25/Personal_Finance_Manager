// routes/cash.route.js
import express from "express";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import User from "../models/User.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/add", secureRoute, async (req, res) => {
  const { accountName, amount, description } = req.body;

  try {
    const account = await Account.findOne({
      userId: req.user._id,
      name: accountName,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const parsedAmount = parseFloat(amount);

if (isNaN(parsedAmount)) {
  return res.status(400).json({ message: "Invalid amount" });
}
    // ✅ Update account balance
    account.balance += parsedAmount;
    await account.save();

    // ✅ Update user balance
    const user = await User.findById(req.user._id);
    user.balance += parsedAmount;
    await user.save();

    // ✅ Create transaction
 const capitalized = description
  ? description.charAt(0).toUpperCase() + description.slice(1)
  : "";

const transaction = new Transaction({
  user: req.user._id,
  note: capitalized
    ? `${capitalized} added to ${account.name}`
    : `Cash added to ${account.name}`,
  category: "Cash",
  amount: parsedAmount,
  type: "income",
  date: new Date().toISOString().slice(0, 10),
});

    await transaction.save();

    res.status(201).json({
      updatedAccount: account,
      updatedBalance: user.balance,
      transaction,
    });
    console.log("Saving transaction note:", transaction.note);

  } catch (err) {
    console.error("Cash addition failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
