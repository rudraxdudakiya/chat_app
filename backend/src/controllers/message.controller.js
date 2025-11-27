import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/User.model.js";

export const getContacts = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessagesByUserId = async (req, res) => {
    const {id: userId} = req.params;
    const loggedUserId = req.user._id;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: loggedUserId, receiverId: userId },
                { senderId: userId, receiverId: loggedUserId }
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllChatPartners = async (req, res) => {
    const loggedUserId = req.user._id;
    
    try {
        const messages = await Message.find({
            $or: [
                { senderId: loggedUserId },
                { receiverId: loggedUserId }
            ]
        });
        const chatPartnerIds = new Set();
        messages.forEach(msg => {
            (msg.senderId.toString() === loggedUserId.toString()) 
            ? chatPartnerIds.add(msg.receiverId.toString())
            : chatPartnerIds.add(msg.senderId.toString());
        });
        const chatPartners = await User.find({ _id: { $in: Array.from(chatPartnerIds) } }).select("-password");
        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error fetching chat partners:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const loggedUserId = req.user._id;
        const {text, image} = req.body;

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
        return res.status(404).json({ message: "Receiver not found." });
        }
        
        if(receiverId.toString() === loggedUserId.toString()) {
            return res.status(400).json({message: "You cannot send a message to yourself"});
        }
        
        if(!text && !image) {
            return res.status(400).json({message: "Message content cannot be empty"});
        }

        let imageurl = null;
        const uploadResult = await cloudinary.uploader.upload(image);
        imageurl = uploadResult.secure_url;

        const newMessage = new Message({
            senderId: loggedUserId,
            receiverId: receiverId,
            text,
            image: imageurl
        });

        await newMessage.save();
        res.status(201).json(newMessage);
        // socket.io --
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}