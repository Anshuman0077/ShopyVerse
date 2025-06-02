import express from "express";
import { addCartItems, getCartItemsdetails, removeCartItems, updateCartItems } from "../controllers/CartController.js";
// import { isAuthenticated} from "../middleware/AuthMiddleware.js";
import {isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post("/add", isAuthenticated, addCartItems);
router.get("/" , isAuthenticated , getCartItemsdetails);
router.patch("/update", isAuthenticated, updateCartItems); 
router.delete("/delete/:id" , isAuthenticated , removeCartItems)


export default router;