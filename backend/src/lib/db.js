import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully :${mongoose.connection.host}`);
    } catch (error) {
        console.log("MongoDb connection error:", error);
    }
};