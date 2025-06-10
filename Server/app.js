import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./serverRoutes/AuthRoutes.js";
import productRoutes from "./serverRoutes/ProductRoutes.js";
import CartRoutes from "./serverRoutes/CartRoutes.js";
import OrderRoutes from "./serverRoutes/OrderRoutes.js"; 
import cookieParser from "cookie-parser";
import cron from "node-cron"
import { autoUpdatedOrders } from "./utils/autoupdated.js";
import AdminTools from "../Server/serverRoutes/AdminTools.js"
import paymentRoutes from "./serverRoutes/paymentRoutes.js";
import bodyParser from "body-parser";
import webhookRoutes from "./serverRoutes/webhookRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

// json body parser
app.use(
  "/api/webhook/stripe",
  bodyParser.raw({  type: "application/json" })
)
//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/admin/tools" , AdminTools)
app.use("/api/payment" , paymentRoutes)
app.use("/api/webhook/stripe" , webhookRoutes)

//  Connect to DB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB connected");
});


cron.schedule("*/10 * * * *", () => {
  console.log("Auto-updating order statuses...");
  autoUpdatedOrders // Your controller that updates status
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
