import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "../lib/env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const serverInstance = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173', // Local development
    'http://localhost:5174',
    'https://chitchat-orpin-six.vercel.app', // Your deployed frontend
    ENV.CLIENT_URL // Environment variable fallback
].filter(Boolean);

const io = new Server(serverInstance, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    allowEIO3: true, // Support older clients
    transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
    pingInterval: 25000,
    pingTimeout: 20000,
    upgradeTimeout: 10000
});

io.use(socketAuthMiddleware);

const userSockets = {};

export function getReceiverSocketId(userId) {
    return userSockets[userId];
}

io.on("connection", (socket) => {
    // Only handle authenticated users
    if (!socket.user) {
        console.log("Socket connected but user not authenticated yet");
        return;
    }

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