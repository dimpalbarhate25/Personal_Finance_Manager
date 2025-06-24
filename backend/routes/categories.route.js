// routes/categories.route.js
import express from "express";
import Category from "../models/Category.js";
import secureRoute from "../middleware/secureRoute.js";

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
    const { name, icon, color } = req.body;

    const category = new Category({
      userId: req.user._id,
      name,
      icon,
      color
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE a category
router.delete("/:id", secureRoute, async (req, res) => {
  try {
    const result = await Category.deleteOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found or not authorized" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
