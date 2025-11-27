import express from "express";
import { isAuthorized } from "../middleware/auth.middleware.js";
import { 
    getContacts, 
    getAllChatPartners, 
    getMessagesByUserId, 
    sendMessage 
} from "../controllers/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(isAuthorized);

router.get("/contacts", getContacts);
router.get("/chats", getAllChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;