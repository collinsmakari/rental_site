import express from "express";

import {
  adminLogin,
  getPendingProperties,
  getAllProperties,
  approveProperty,
  rejectProperty,
} from "../controllers/adminController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ADMIN LOGIN
|--------------------------------------------------------------------------
| This route MUST come before router.use(adminMiddleware).
| The admin does not have a JWT before logging in.
*/
router.post("/login", adminLogin);

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN ROUTES
|--------------------------------------------------------------------------
| Everything below this line requires a valid JWT.
*/
router.use(adminMiddleware);

/*
|--------------------------------------------------------------------------
| Pending properties
|--------------------------------------------------------------------------
*/
router.get(
  "/properties/pending",
  getPendingProperties
);

/*
|--------------------------------------------------------------------------
| All properties
|--------------------------------------------------------------------------
*/
router.get(
  "/properties",
  getAllProperties
);

/*
|--------------------------------------------------------------------------
| Approve property
|--------------------------------------------------------------------------
*/
router.patch(
  "/properties/:id/approve",
  approveProperty
);

/*
|--------------------------------------------------------------------------
| Reject property
|--------------------------------------------------------------------------
*/
router.patch(
  "/properties/:id/reject",
  rejectProperty
);

export default router;