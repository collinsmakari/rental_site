import dns from "dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import connectDB from "./config/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ==================================================
// ENVIRONMENT CONFIGURATION
// ==================================================

dotenv.config();

// ==================================================
// DNS CONFIGURATION
// Helps with MongoDB/Daraja DNS resolution on Render
// ==================================================

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ==================================================
// EXPRESS APP
// ==================================================

const app = express();

const PORT = process.env.PORT || 5000;

// ==================================================
// TRUST PROXY
// Required because Render sits behind a proxy
// ==================================================

app.set("trust proxy", 1);

// ==================================================
// SECURITY HEADERS
// ==================================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ==================================================
// CORS CONFIGURATION
// ==================================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests that do not contain an Origin header
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`Blocked CORS request from: ${origin}`);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// ==================================================
// REQUEST BODY LIMITS
// Prevent extremely large JSON requests
// ==================================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// ==================================================
// REQUEST SANITIZATION
// ==================================================

app.use(hpp());

// ==================================================
// GENERAL API RATE LIMITER
// ==================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Maximum requests from one IP
  // during the 15-minute window.
  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Apply to all API endpoints
app.use("/api", apiLimiter);

// ==================================================
// STRICT PAYMENT RATE LIMITER
// ==================================================
//
// Payment initiation is much more sensitive than
// normal property browsing.
//
// Maximum 5 payment initiation requests per IP
// every 10 minutes.
//

const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many payment attempts. Please try again later.",
  },
});

app.use(
  "/api/payments/initiate",
  paymentLimiter
);

// ==================================================
// DATABASE CONNECTION
// ==================================================

connectDB();

// ==================================================
// API ROUTES
// ==================================================

app.use(
  "/api/properties",
  propertyRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// ==================================================
// ROOT / HEALTH CHECK
// ==================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rental backend API is running",
  });
});

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  // ----------------------------------------------
  // CORS ERROR
  // ----------------------------------------------

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  // ----------------------------------------------
  // BODY PARSING ERROR
  // ----------------------------------------------

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large",
    });
  }

  // ----------------------------------------------
  // GENERAL ERROR
  // ----------------------------------------------

  const isProduction =
    process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    success: false,
    message: isProduction
      ? "Something went wrong. Please try again later."
      : err.message || "Internal server error",
  });
});

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("RentMe Rental Backend");
  console.log("=================================");
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("Helmet: Enabled");
  console.log("CORS: Enabled");
  console.log("Rate Limiting: Enabled");
  console.log("Request Sanitization: Enabled");
  console.log("=================================");
});