import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Get token from cookies instead of header
    const token = req.cookies?.token;  // assumes cookie named 'token'
    
    // 2. Check if token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, please login",
      });
    }

    // 3. Verify the token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. If decoding fails (decoded will throw error), catch block will handle it.
    // But we can still check decoded here to be safe
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token, please login again",
      });
    }

    // 5. Fetch the user from DB using the userId stored inside token payload
    req.user = await User.findById(decoded.userId).select("-password");

    // 6. If no user found for this id
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 7. If everything is fine, move to next middleware/controller
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    // 8. Check user role (req.user is already attached by isAuthenticated)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
