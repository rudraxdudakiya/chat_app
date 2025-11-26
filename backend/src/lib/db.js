import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        const {MONGO_URL} = ENV;
        if(!MONGO_URL) {
            throw new Error("MONGO_URL is not defined in environment variables");
        }
        
        await mongoose.connect(MONGO_URL);
        console.log("DB connected successfully. ", mongoose.connection.host);
    } catch (error) {
        console.log("DB connection error:", error);
        process.exit(1); //1=fails 0=success
    }
}