import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/user.route.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const URL = process.env.MONGODB_URI;

mongoose.connect(URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
