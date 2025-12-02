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

app.use(cors({origin: ENV.CLIENT_URL, credentials: true})); // enabling CORS for frontend requests

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!", timestamp: new Date().toISOString() });
});

app.use(cors({
  origin: [
    'http://localhost:5173', // Keep this for local development
    'https://chitchat-orpin-six.vercel.app' // Add your deployed frontend URL here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // If you are sending cookies or authorization headers
}));


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
