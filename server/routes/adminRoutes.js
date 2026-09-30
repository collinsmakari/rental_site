import express from "express";
import rateLimit from "express-rate-limit";
import {
  adminLogin,
  getPendingProperties,
  getAllProperties,
  approveProperty,
  rejectProperty,
  toggleFeaturedProperty,
} from "../controllers/adminController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN RATE LIMITER
|--------------------------------------------------------------------------
| Protects the admin login endpoint against brute-force attacks.
|
| Maximum:
| - 5 failed login attempts
| - per IP address
| - within 15 minutes
|
| Successful login attempts are not counted against the limit.
|
| This limiter only applies to:
|
| POST /api/admin/login
|
|--------------------------------------------------------------------------
*/

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  /*
   * Only failed login attempts count toward the limit.
   *
   * A successful login resets the user's rate-limit
   * counter for practical purposes.
   */
  skipSuccessfulRequests: true,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
  },

  handler: (req, res) => {
    console.warn(
      `Admin login rate limit exceeded from IP: ${req.ip}`
    );

    return res.status(429).json({
      success: false,
      message:
        "Too many login attempts. Please try again later.",
    });
  },
});

/*
|--------------------------------------------------------------------------
| PUBLIC ADMIN LOGIN
|--------------------------------------------------------------------------
| This route MUST come before router.use(adminMiddleware).
|
| The admin does not have a JWT before logging in.
|
| The rate limiter is applied before adminLogin.
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  adminLoginLimiter,
  adminLogin
);

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN ROUTES
|--------------------------------------------------------------------------
| Everything below this line requires a valid JWT.
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| Toggle featured property
|--------------------------------------------------------------------------
*/

router.patch(
  "/properties/:id/featured",
  toggleFeaturedProperty
);

export default router;