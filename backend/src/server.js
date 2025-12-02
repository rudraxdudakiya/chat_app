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

// for deployement - only serve frontend if dist folder exists
if(ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  const fs = await import('fs');
  
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    
    app.get("*", (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: "API route not found" });
      }
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.log("Frontend dist folder not found - running as API-only backend");
    app.get("*", (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: "API route not found" });
      }
      res.json({ 
        message: "Chat App Backend API", 
        frontend: "Deploy frontend separately",
        health: "/api/health"
      });
    });
  }
}

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
