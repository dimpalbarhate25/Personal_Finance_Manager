// routes/user.route.js
import express from 'express';
import { signup, login, logout, getUserProfile } from '../controller/user.controller.js';
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", secureRoute, getUserProfile); // 🔒 Protected route

export default router;
