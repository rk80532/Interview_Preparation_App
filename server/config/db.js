import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Trying MongoDB connection...");
    console.log("URI loaded:", !!process.env.MONGO_URI);
    console.log(
      "URI preview:",
      process.env.MONGO_URI?.replace(/:(.*?)@/, ":****@"),
    );

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
