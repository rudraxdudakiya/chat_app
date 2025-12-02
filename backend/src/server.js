import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, serverInstance } from "./lib/soketio.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); //middleware to parse json body in request (req.body)
app.use(cookieParser()); //middleware to parse cookies in request (req.cookies)

// CORS configuration for multiple environments
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://chitchat-orpin-six.vercel.app', // Your deployed frontend
    ENV.CLIENT_URL // Environment variable fallback
  ].filter(Boolean), // Remove any undefined values
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!", timestamp: new Date().toISOString() });
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Chat App Backend API", health: "/api/health" });
});


connectDB()
  .then(() => {
    serverInstance.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  });
