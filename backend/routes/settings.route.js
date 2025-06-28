// routes/settings.route.js
import express from "express";
import Settings from "../models/Settings.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// GET current user settings
router.get("/", secureRoute, async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.user._id });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create settings
router.post("/", secureRoute, async (req, res) => {
  try {
    const existing = await Settings.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Settings already exist" });
    }

    const newSettings = new Settings({
      userId: req.user._id,
      ...req.body
    });

    await newSettings.save();
    res.status(201).json(newSettings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update settings
router.put("/", secureRoute, async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
