import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Or check Authorization header (Bearer <token>)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token", success: false });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Not authorized, token failed", success: false });
  }
};


export const adminOnly = (req, res, next) => {
  try {
    // Make sure req.user exists (from protect middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized", success: false });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin only", success: false });
    }

    // ✅ User is admin, proceed
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

