import express from "express";
import Transaction from "../models/Transaction.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// ➕ Create new transaction
router.post("/", protect, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount,
      category,
      note,
      date
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
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

export default router;
