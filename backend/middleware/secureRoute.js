// middleware/secureRoute.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const secureRoute = async (req, res, next) => {
  try {
    let token;

    // ✅ Get token from cookie
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // ✅ OR from Authorization header (for Postman)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user and attach to req
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default secureRoute;
