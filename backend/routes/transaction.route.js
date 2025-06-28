import express from "express";
import Transaction from "../models/Transaction.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// ➕ Create new transaction
// ➕ Create new transaction and update user balance
router.post("/", protect, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;
    const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount: signedAmount,
      category,
      note,
      date
    });

    await transaction.save();

    // 🔄 Update user's balance
    const user = req.user;
    user.balance = (user.balance || 0) + signedAmount;
    await user.save();

    res.status(201).json({ transaction, newBalance: user.balance });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ message: "Failed to save transaction", error });
  }
});


// 📦 Get all transactions of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
});




export default router;
