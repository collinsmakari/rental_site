import dns from "dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

import connectDB from "./config/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Rental backend API is running",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("Rental backend running");
  console.log(`Port: ${PORT}`);
 // console.log(`http://localhost:${PORT}`);
  console.log("=================================");
});