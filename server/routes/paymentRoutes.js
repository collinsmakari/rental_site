import express from "express";

import {
  initiatePayment,
  mpesaCallback,
  checkPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

// ==========================================
// INITIATE PAYMENT
// ==========================================

router.post(
  "/initiate",
  initiatePayment
);


// ==========================================
// M-PESA CALLBACK
// ==========================================

router.post(
  "/callback",
  mpesaCallback
);


// ==========================================
// CHECK PAYMENT STATUS
// ==========================================

router.get(
  "/status/:paymentId",
  checkPaymentStatus
);

export default router;