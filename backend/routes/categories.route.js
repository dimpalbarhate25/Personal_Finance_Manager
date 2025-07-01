// routes/categories.route.js
import express from "express";
import Category from "../models/Category.js";
import User from "../models/User.js";

import secureRoute from "../middleware/secureRoute.js";
import Transaction from "../models/Transaction.js"; // ✅ Add this

const router = express.Router();

// ✅ GET all categories for the user
router.get("/", secureRoute, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST new category
router.post("/", secureRoute, async (req, res) => {
  try {
    const { name, icon, color, budgetLimit } = req.body;

    const category = new Category({
      userId: req.user._id,
      name,
      icon,
      color,
budgetLimit: budgetLimit !== undefined ? budgetLimit : 1000
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE a category
// DELETE /api/categories/full-delete/:id
// DELETE /api/transactions/category/:categoryName
// DELETE /api/categories/:id

router.delete("/:id", secureRoute, async (req, res) => {
  try {
    // Find the category
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find and delete related transactions
    const relatedTransactions = await Transaction.find({
      userId: req.user._id,
      category: deletedCategory.name,
    });

    let refundedAmount = 0;

    relatedTransactions.forEach((tx) => {
      if (tx.type === "expense") {
        refundedAmount += Math.abs(tx.amount || tx.sum || 0);
      } else if (tx.type === "income") {
        refundedAmount -= Math.abs(tx.amount || tx.sum || 0);
      }
    });

    // Delete the transactions
    await Transaction.deleteMany({
      userId: req.user._id,
      category: deletedCategory.name,
    });
 const user = await User.findById(req.user._id);
    if (user) {
      user.balance = (user.balance || 0) + refundedAmount;
      await user.save();
    }
    // Send back the amount that should be added back to balance
    res.json({
      message: "Category and transactions deleted",
      refundedAmount,
       newBalance: user.balance,
    });
  } catch (err) {
    console.error("Delete category error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update budget limit for a category
router.patch("/:id", secureRoute, async (req, res) => {
  const { id } = req.params;
  const { budgetLimit } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { budgetLimit },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
