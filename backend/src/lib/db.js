import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully. ", mongoose.connection.host);
    } catch (error) {
        console.log("DB connection error:", error);
        process.exit(1); //1=fails 0=success
    }
}