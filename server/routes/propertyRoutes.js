import express from "express";

import {
  createProperty,
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  getProtectedProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE PROPERTY
// LANDLORD / CARETAKER SUBMISSION
// ==========================================

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createProperty
);

// ==========================================
// GET FEATURED PROPERTIES
// PUBLIC
// ==========================================

router.get(
  "/featured",
  getFeaturedProperties
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