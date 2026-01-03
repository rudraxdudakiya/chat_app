import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ENV } from "../lib/env.js"

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];   
        
        if (!token) {
            // Allow unauthenticated connections; user will authenticate after login
            console.log("Socket connection: No token yet (user not logged in)");
            socket.user = null;
            socket.userId = null;
            return next();
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }
        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket authenticated for user: ${user.fullname} (${user._id})`);
        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        return next(new Error("Authentication error"));
    }
}
