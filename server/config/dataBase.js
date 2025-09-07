import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://alleshanthankumarreddy666999_db_user:0H9QBJBfGdQY5pWJ@cluster0.xt7knov.mongodb.net/medosof");
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
