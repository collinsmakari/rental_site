import express from "express";

import {
  getPendingProperties,
  getAllProperties,
  approveProperty,
  rejectProperty,
} from "../controllers/adminController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// All admin routes require authentication
router.use(adminMiddleware);

// Get pending properties
router.get("/properties/pending", getPendingProperties);

// Get all properties
router.get("/properties", getAllProperties);

// Approve property
router.patch(
  "/properties/:id/approve",
  approveProperty
);

// Reject property
router.patch(
  "/properties/:id/reject",
  rejectProperty
);

export default router;