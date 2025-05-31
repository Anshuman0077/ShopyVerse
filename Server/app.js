import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./serverRoutes/AuthRoutes.js"
import productRoutes from "./serverRoutes/ProductRoutes.js";




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB connected",);
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
