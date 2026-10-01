import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    // Reuse existing connection if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    const startTime = Date.now();

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
      }
    );

    const connectionTime = Date.now() - startTime;

    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log(`Mongo host: ${connection.connection.host}`);
    console.log(`MongoDB connection time: ${connectionTime} ms`);
    console.log("=================================");

    return connection;
  } catch (error) {
    console.error("=================================");
    console.error("MongoDB connection failed");
    console.error(error.message);
    console.error("=================================");

    process.exit(1);
  }
};

export default connectDB;