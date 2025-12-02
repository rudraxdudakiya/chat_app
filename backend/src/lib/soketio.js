import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "../lib/env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const serverInstance = http.createServer(app);

const io = new Server(serverInstance, {
    cors: {
        origin: [
            'http://localhost:5173', // Local development
            'https://chitchat-orpin-six.vercel.app', // Your deployed frontend
            ENV.CLIENT_URL // Environment variable fallback
        ].filter(Boolean), // Remove any undefined values
        credentials: true,
        methods: ['GET', 'POST']
    },
    allowEIO3: true, // Support older clients
    transports: ['polling', 'websocket'], // Ensure both transports are enabled
});

io.use(socketAuthMiddleware);

const userSockets = {};

export function getReceiverSocketId(userId) {
    return userSockets[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected.", socket.user.fullname);
    
    const userId = socket.user._id.toString();
    userSockets[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSockets));

    socket.on("disconnect", () => {
        console.log("A user disconnected.", socket.user.fullname);
        delete userSockets[userId];
        io.emit("getOnlineUsers", Object.keys(userSockets));
    });
});

export { io, app, serverInstance };