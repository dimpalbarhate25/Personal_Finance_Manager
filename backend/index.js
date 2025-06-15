// index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGODB_URI;

// ✅ Flexible CORS setup: allow all localhost origins with credentials
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost")) {
      callback(null, true); // ✅ allow all localhost:* origins
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // ✅ allow cookies / Authorization headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // ✅ required for reading cookies

// ✅ MongoDB connection
mongoose
  .connect(MONGO_URI, {
    dbName: "finance_manager"
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/user", userRoute);

// ✅ Optional test route to verify CORS
app.get("/test-cors", (req, res) => {
  res.json({ success: true, message: "CORS working from: " + req.headers.origin });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
