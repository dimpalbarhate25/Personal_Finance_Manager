// middleware/secureRoute.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const secureRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // ⬅️ JWT expected in cookie

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.User = user; // ✅ Standard naming for consistency with your controller
    next();
  } catch (error) {
    console.error("secureRoute error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default secureRoute;
