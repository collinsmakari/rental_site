import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log(`Mongo host: ${connection.connection.host}`);
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("MongoDB connection failed");
    console.error(error.message);
    console.error("=================================");

    process.exit(1);
  }
};

export default connectDB;