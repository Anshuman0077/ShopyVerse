import express from "express";

import {getAllProducts,   getSingleProduct , creatrProduct , updatedProduct, deletedProduct  } from "../controllers/ProductController.js";
import { isAuthenticated, isAdmin } from "../middleware/AuthMiddleware.js";


const router = express.Router();

router.post("/create" ,  isAuthenticated, isAdmin ,creatrProduct);
router.get("/" , isAuthenticated , getAllProducts);
router.get("/:id" , isAuthenticated, getSingleProduct);
router.put("/:id" , isAuthenticated , isAdmin, updatedProduct);
router.delete("/:id" , isAuthenticated , isAdmin , deletedProduct);

export default router;