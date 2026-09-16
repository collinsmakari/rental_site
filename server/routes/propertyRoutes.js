import express from "express";

import {
  createProperty,
  getProperties,
  getPropertyById,
  getProtectedProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

// ==========================================
// CREATE PROPERTY
// ==========================================

router.post(
  "/",
  createProperty
);

// ==========================================
// GET ALL PROPERTIES
// PUBLIC
// ==========================================

router.get(
  "/",
  getProperties
);

// ==========================================
// GET PROTECTED PROPERTY INFORMATION
// PAYMENT REQUIRED
// ==========================================

router.get(
  "/:id/unlocked",
  getProtectedProperty
);

// ==========================================
// GET SINGLE PROPERTY
// PUBLIC
// ==========================================

router.get(
  "/:id",
  getPropertyById
);

// ==========================================
// UPDATE PROPERTY
// ==========================================

router.put(
  "/:id",
  updateProperty
);

// ==========================================
// DELETE PROPERTY
// ==========================================

router.delete(
  "/:id",
  deleteProperty
);

export default router;