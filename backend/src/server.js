import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);

// for deployement
if(process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../frontend/dist"))
  );
}

app.get("*", (_, res)=>{
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});