import express from "express";
import { signup, login, logout, editProfile } from "../controllers/auth.controller.js";
import { isAuthorized } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/edit-profile", isAuthorized, editProfile);

router.get("/check-auth", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const jwt = await import("jsonwebtoken");
        const { ENV } = await import("../lib/env.js");
        const decoded = jwt.default.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        const user = await (await import("../models/User.model.js")).default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Check auth error:", error);
        return res.status(401).json({ message: "Not authenticated" });
    }
});

export default router;