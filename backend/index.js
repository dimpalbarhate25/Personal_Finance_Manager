import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import transactionsRoutes from "./routes/transaction.route.js";
import accountsRoutes from "./routes/accounts.route.js";
import settingsRoutes from "./routes/settings.route.js";
import categoriesRoutes from "./routes/categories.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGODB_URI;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/categories", categoriesRoutes);


mongoose
  .connect(MONGO_URI, { dbName: "finance_manager" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/user", userRoute);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/categories", categoriesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
