// routes/user.route.js
import express from 'express';
import { signup, login, logout, getUserProfile } from '../controller/user.controller.js';
import secureRoute from '../middleware/secureRoute.js';
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", secureRoute, getUserProfile); // 🔒 Protected route
// POST /update-balance ✅
router.post("/update-balance", secureRoute, async (req, res) => {
  const { delta } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += delta;
    await user.save();

    res.status(200).json({ newBalance: user.balance });
  } catch (error) {
    console.error("❌ Failed to update balance:", error);
    res.status(500).json({ message: "Failed to update balance" });
  }
});

export default router;
