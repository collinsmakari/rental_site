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
*/
router.post(
  "/login",
  (req, res, next) => {
    console.log(
      "========== ADMIN LOGIN ROUTE REACHED =========="
    );

    console.log(
      "Request body:",
      req.body
    );

    next();
  },
  adminLogin
);

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN ROUTES
|--------------------------------------------------------------------------
*/
router.use(adminMiddleware);

router.get(
  "/properties/pending",
  getPendingProperties
);

router.get(
  "/properties",
  getAllProperties
);

router.patch(
  "/properties/:id/approve",
  approveProperty
);

router.patch(
  "/properties/:id/reject",
  rejectProperty
);

export default router;