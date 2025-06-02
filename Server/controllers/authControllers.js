import User from "../models/UserModel.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




// Registration /////
export const registration = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists", success: false });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
    console.log(user);
    

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};



/// LOGIN ////

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not found, please register",
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password ",
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

      res.cookie("token", token, {
      httpOnly: true, // prevents JS access for security
      secure: process.env.NODE_ENV === "production", // cookie only sent over https in production
      sameSite: "strict", // protects from CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
     


    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};
