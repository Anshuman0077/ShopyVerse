import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";


export const isAuthenticated = async (req , res ,next) => {
   try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided, please login"
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid token, please login again"
        });
    }
    req.user = await User.findById(decoded.userId).select("-password")
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    
        next();
    
   } catch (error) {
         return res.status(500).json({
              success: false,
              message: error.message || "Server error"
         });
       
    
   }

}


export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied, admin only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}