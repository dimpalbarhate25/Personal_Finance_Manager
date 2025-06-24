import express from "express";
import Account from "../models/Account.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// ✅ GET accounts for logged-in user
router.get("/", secureRoute, async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id });
  res.json(accounts);
});

// ✅ POST create new account
router.post("/", secureRoute, async (req, res) => {
  const { name, type, balance, icon } = req.body;

  const account = new Account({
    userId: req.user._id, // ✅ make sure this is correct
    name,
    type,
    balance,
    icon
  });

  await account.save();
  res.status(201).json(account);
});

// ✅ DELETE account
router.delete("/:id", secureRoute, async (req, res) => {
  await Account.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Account deleted" });
});

export default router;
