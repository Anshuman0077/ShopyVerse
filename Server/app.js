import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./serverRoutes/AuthRoutes.js";
import productRoutes from "./serverRoutes/ProductRoutes.js";
import CartRoutes from "./serverRoutes/CartRoutes.js";
import OrderRoutes from "./serverRoutes/OrderRoutes.js"; // ✅ New
import cookieParser from "cookie-parser";
import cron from "node-cron"
import { autoUpdatedOrders } from "./utils/autoupdated.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/orders", OrderRoutes); // ✅ Order routes

// ✅ Connect to DB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB connected");
});


cron.schedule("*/10 * * * *", () => {
  console.log("⏰ Auto-updating order statuses...");
  autoUpdatedOrders // Your controller that updates status
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
