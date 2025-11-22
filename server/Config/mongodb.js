import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
  try {
    await mongoose.connect( "mongodb+srv://alleshanthankumarreddy666999_db_user:dI6kJZHlaVh3Xo2S@cluster0.xt7knov.mongodb.net/medosof");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

