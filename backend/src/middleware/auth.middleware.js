import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/User.model.js";


export const isAuthorized = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        // Debug logging (remove after fixing)
        console.log("Auth check - Cookies received:", req.cookies);
        console.log("Auth check - JWT token:", token ? "Present" : "Missing");
        console.log("Auth check - Origin:", req.headers.origin);
        console.log("Auth check - NODE_ENV:", ENV.NODE_ENV);
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Unauthorized: User not found" });
        }
        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}