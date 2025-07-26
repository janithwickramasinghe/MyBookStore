import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Connection Failed: ", error.message);
    }
};

export default connectDB;