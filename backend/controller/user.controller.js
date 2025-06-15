import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

// ✅ SIGNUP with profession
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, profession } = req.body;

    if (!name || !email || !password || !confirmpassword || !profession) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profession, // ✅ saving profession
    });

    await newUser.save();

    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          profession: newUser.profession,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
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

    createTokenAndSaveCookie(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const loggedInUser = req.User._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.log("Error in getUserProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
