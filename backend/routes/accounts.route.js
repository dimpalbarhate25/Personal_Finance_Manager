import express from "express";
import Transaction from "../models/Transaction.js"; 
import Account from "../models/Account.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// ✅ GET accounts for logged-in user
router.get("/", secureRoute, async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id });
  res.json(accounts);
});

// ✅ POST create new account
import User from "../models/User.js"; // ✅ Import User


router.post("/", secureRoute, async (req, res) => {
  const { name, type, balance: rawBalance, icon } = req.body;
  const balance = parseFloat(rawBalance);

  if (!name || !type || isNaN(balance)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    // ✅ 1. Create account
    const account = new Account({
      userId: req.user._id,
      name,
      type,
      balance,
      icon,
    });

    await account.save();

    // ✅ 2. Update user balance
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += balance;
    await user.save();

    // ✅ 3. Log this as a transaction
    const transaction = new Transaction({
      user: req.user._id,
      note: `Initial deposit to ${name}`,
      category: "Accounts",
      amount: balance,
      date: new Date().toISOString().slice(0, 10),
      type: "income",
    });

    console.log("Creating transaction with amount:", balance);
    await transaction.save();

    res.status(201).json({ account, updatedBalance: user.balance });

  } catch (err) {
    console.error("Error adding account:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



// POST /api/cash/add

// ✅ DELETE account

router.delete("/:id", secureRoute, async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // ✅ Subtract balance from user
    const user = await User.findById(req.user._id);
    user.balance -= account.balance || 0;
    await user.save();

    // ✅ Delete related transactions (based on note or category logic)
    await Transaction.deleteMany({
      user: req.user._id,
      note: { $regex: `^Initial deposit to ${account.name}`, $options: "i" },
    });

    res.json({
      message: "Account and related transactions deleted",
      updatedBalance: user.balance,
    });
  } catch (err) {
    console.error("Delete account error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
