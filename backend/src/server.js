import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";


const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json()); //middleware to parse json body in request (req.body)
app.use(cookieParser()); //middleware to parse cookies in request (req.cookies)


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);

// for deployement
if(ENV.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../frontend/dist"))
  );
}
app.get("*", (_, res)=>{
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  });
