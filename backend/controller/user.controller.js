// controller/user.controller.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, profession } = req.body;

    if (!name || !email || !password || !confirmpassword || !profession) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profession
    });

    await newUser.save();

    const token = createTokenAndSaveCookie(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profession: newUser.profession
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createTokenAndSaveCookie(user._id, res);

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controller/user.controller.js
export const getUserProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
console.log("User from middleware:", req.user);

    // ✅ Fetch the actual logged-in user
    const currentUser = await User.findById(loggedInUserId).select("-password");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        profession: currentUser.profession,
        balance: currentUser.balance, // ✅ this will now work
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
