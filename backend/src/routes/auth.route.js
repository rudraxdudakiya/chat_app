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

router.get("/check-auth", isAuthorized, (req, res) => {
    res.status(200).json({ message: "You are authorized", user: req.user });
});

export default router;