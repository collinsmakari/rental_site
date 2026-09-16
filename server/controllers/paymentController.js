
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Property from "../models/Property.js";
import { initiateSTKPush } from "../services/mpesaService.js";

// ==========================================
// INITIATE M-PESA PAYMENT
// ==========================================

export const initiatePayment = async (req, res) => {
  try {
    const { propertyId, phoneNumber } = req.body;

    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (!propertyId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Property ID and phone number are required",
      });
    }

    // ==========================================
    // FIND PROPERTY IN MONGODB
    // ==========================================

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // ==========================================
    // GET VIEWING FEE DIRECTLY FROM PROPERTY
    // ==========================================

    const amount = Number(property.viewingFee);

    console.log("=================================");
    console.log("PROPERTY PAYMENT");
    console.log("Property ID:", property._id);
    console.log("Property:", property.title);
    console.log("Viewing Fee from MongoDB:", property.viewingFee);
    console.log("Viewing Fee Type:", typeof property.viewingFee);
    console.log("Amount sent to M-Pesa:", amount);
    console.log("=================================");

    // ==========================================
    // VALIDATE VIEWING FEE
    // ==========================================

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "This property does not have a valid viewing fee",
      });
    }

    // ==========================================
    // CREATE PENDING PAYMENT
    // ==========================================

    const payment = await Payment.create({
      property: property._id,
      phoneNumber,
      amount,
      status: "pending",
    });

    // ==========================================
    // INITIATE M-PESA STK PUSH
    // ==========================================

    const stkResponse = await initiateSTKPush({
      phoneNumber,
      amount,
      accountReference: `PROPERTY-${property._id}`,
      transactionDescription: "Property Viewing Fee",
    });

    // ==========================================
    // SAVE M-PESA TRANSACTION IDENTIFIERS
    // ==========================================

    payment.merchantRequestId =
      stkResponse.MerchantRequestID;

    payment.checkoutRequestId =
      stkResponse.CheckoutRequestID;

    await payment.save();

    // ==========================================
    // LOG PAYMENT
    // ==========================================

    console.log("========== PAYMENT CREATED ==========");
    console.log("Payment ID:", payment._id);
    console.log("Property ID:", property._id);
    console.log("Property:", property.title);
    console.log("Viewing Fee:", amount);
    console.log(
      "Merchant Request ID:",
      payment.merchantRequestId
    );
    console.log(
      "Checkout Request ID:",
      payment.checkoutRequestId
    );
    console.log("Status:", payment.status);
    console.log("=====================================");

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "M-Pesa payment initiated successfully",

      paymentId: payment._id,

      propertyId: property._id,

      // Fee actually read from MongoDB
      amount,

      checkoutRequestId:
        payment.checkoutRequestId,

      status: payment.status,
    });
  } catch (error) {
    console.error(
      "========== INITIATE PAYMENT ERROR =========="
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to initiate M-Pesa payment",
      error: error.message,
    });
  }
};

// ==========================================
// M-PESA CALLBACK
// ==========================================

export const mpesaCallback = async (req, res) => {
  try {
    console.log("\n=================================");
    console.log("========== MPESA CALLBACK ==========");
    console.log("=================================");

    console.log(
      "Callback received:",
      JSON.stringify(req.body, null, 2)
    );

    const stkCallback =
      req.body?.Body?.stkCallback;

    if (!stkCallback) {
      console.error("Invalid M-Pesa callback");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received",
      });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    console.log(
      "Merchant Request ID:",
      MerchantRequestID
    );

    console.log(
      "Checkout Request ID:",
      CheckoutRequestID
    );

    console.log(
      "Result Code:",
      ResultCode
    );

    console.log(
      "Result Description:",
      ResultDesc
    );

    // ==========================================
    // FIND PAYMENT
    // ==========================================

    const payment = await Payment.findOne({
      checkoutRequestId: CheckoutRequestID,
    });

    if (!payment) {
      console.error(
        "Payment not found for CheckoutRequestID:",
        CheckoutRequestID
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received",
      });
    }

    // ==========================================
    // SAVE CALLBACK INFORMATION
    // ==========================================

    payment.merchantRequestId =
      MerchantRequestID;

    payment.resultCode =
      Number(ResultCode);

    payment.resultDescription =
      ResultDesc;

    // ==========================================
    // SUCCESSFUL PAYMENT
    // ==========================================

    if (Number(ResultCode) === 0) {
      console.log(
        "========== PAYMENT SUCCESS =========="
      );

      payment.status = "completed";

      // ==========================================
      // GENERATE PROPERTY ACCESS TOKEN
      // ==========================================

      if (!payment.accessToken) {
        payment.accessToken =
          crypto.randomBytes(32).toString("hex");

        console.log(
          "Property access token generated"
        );
      }

      // ==========================================
      // EXTRACT M-PESA METADATA
      // ==========================================

      const items =
        CallbackMetadata?.Item || [];

      const getMetadataValue = (name) => {
        const item = items.find(
          (item) => item.Name === name
        );

        return item?.Value;
      };

      payment.mpesaReceiptNumber =
        getMetadataValue(
          "MpesaReceiptNumber"
        ) || null;

      payment.transactionDate =
        getMetadataValue(
          "TransactionDate"
        )?.toString() || null;

      console.log(
        "M-Pesa Receipt:",
        payment.mpesaReceiptNumber
      );

      console.log(
        "Transaction Date:",
        payment.transactionDate
      );

      console.log(
        "Access Token Generated:",
        Boolean(payment.accessToken)
      );
    } else {
      // ==========================================
      // PAYMENT FAILED
      // ==========================================

      payment.status = "failed";

      console.log(
        "========== PAYMENT FAILED =========="
      );

      console.log(
        "Result Code:",
        ResultCode
      );

      console.log(
        "Reason:",
        ResultDesc
      );
    }

    // ==========================================
    // SAVE PAYMENT
    // ==========================================

    await payment.save();

    console.log(
      "Payment updated successfully"
    );

    console.log(
      "Payment ID:",
      payment._id
    );

    console.log(
      "Payment status:",
      payment.status
    );

    console.log(
      "Access token exists:",
      Boolean(payment.accessToken)
    );

    console.log(
      "=================================\n"
    );

    // ==========================================
    // ACKNOWLEDGE SAFARICOM
    // ==========================================

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc:
        "Callback processed successfully",
    });
  } catch (error) {
    console.error(
      "========== CALLBACK ERROR =========="
    );

    console.error(error);

    console.error(
      "===================================="
    );

    // Always acknowledge callback
    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback received",
    });
  }
};

// ==========================================
// CHECK PAYMENT STATUS
// ==========================================

export const checkPaymentStatus = async (
  req,
  res
) => {
  try {
    const { paymentId } = req.params;

    const payment =
      await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,

      payment: {
        id: payment._id,

        propertyId:
          payment.property,

        amount:
          payment.amount,

        status:
          payment.status,

        checkoutRequestId:
          payment.checkoutRequestId,

        mpesaReceiptNumber:
          payment.mpesaReceiptNumber,

        resultCode:
          payment.resultCode,

        resultDescription:
          payment.resultDescription,

        // Only expose token after successful payment
        accessToken:
          payment.status === "completed"
            ? payment.accessToken
            : null,
      },
    });
  } catch (error) {
    console.error(
      "Check payment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to check payment status",
      error: error.message,
    });
  }
};