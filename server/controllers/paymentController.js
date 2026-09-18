import crypto from "crypto";
import Payment from "../models/Payment.js";
import Property from "../models/Property.js";
import { initiateSTKPush } from "../services/mpesaService.js";

// =====================================================
// INITIATE M-PESA PAYMENT
// =====================================================

export const initiatePayment = async (req, res) => {
  try {
    const { propertyId, phoneNumber } = req.body;

    // =================================================
    // VALIDATE REQUIRED FIELDS
    // =================================================

    if (!propertyId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Property ID and phone number are required",
      });
    }

    // =================================================
    // FIND PROPERTY
    // =================================================

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // =================================================
    // GET VIEWING FEE FROM MONGODB
    // =================================================

    const amount = Number(property.viewingFee);

    console.log(
      "================================="
    );

    console.log(
      "========== PROPERTY PAYMENT =========="
    );

    console.log(
      "Property ID:",
      property._id.toString()
    );

    console.log(
      "Property:",
      property.title
    );

    console.log(
      "Viewing Fee from MongoDB:",
      property.viewingFee
    );

    console.log(
      "Amount sent to M-Pesa:",
      amount
    );

    console.log(
      "Phone Number:",
      phoneNumber
    );

    console.log(
      "================================="
    );

    // =================================================
    // VALIDATE VIEWING FEE
    // =================================================

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This property does not have a valid viewing fee",
      });
    }

    // =================================================
    // OPTIONAL DUPLICATE PROTECTION
    // =================================================
    //
    // This prevents accidental double-clicks by the SAME
    // customer while allowing DIFFERENT customers to
    // make payments simultaneously.
    //
    // We only look for a recent pending transaction
    // belonging to the same property + phone number.
    //
    // Different users are NOT blocked.
    // =================================================

    const normalizedPhone =
      String(phoneNumber).trim();

    const existingPayment =
      await Payment.findOne({
        property: property._id,
        phoneNumber: normalizedPhone,
        status: "pending",
        createdAt: {
          $gte:
            new Date(
              Date.now() -
                5 * 60 * 1000
            ),
        },
      }).sort({
        createdAt: -1,
      });

    if (
      existingPayment &&
      existingPayment.checkoutRequestId
    ) {
      console.log(
        "========== EXISTING PAYMENT =========="
      );

      console.log(
        "Reusing pending payment:",
        existingPayment._id
      );

      console.log(
        "Checkout Request ID:",
        existingPayment.checkoutRequestId
      );

      console.log(
        "======================================="
      );

      return res.status(200).json({
        success: true,
        message:
          "An M-Pesa payment is already being processed",
        paymentId:
          existingPayment._id,
        propertyId:
          property._id,
        amount:
          existingPayment.amount,
        checkoutRequestId:
          existingPayment.checkoutRequestId,
        status:
          existingPayment.status,
      });
    }

    // =================================================
    // CREATE PAYMENT FIRST
    // =================================================

    const payment = await Payment.create({
      property: property._id,
      phoneNumber: normalizedPhone,
      amount,
      status: "pending",
    });

    console.log(
      "================================="
    );

    console.log(
      "========== PAYMENT CREATED =========="
    );

    console.log(
      "Payment ID:",
      payment._id.toString()
    );

    console.log(
      "Property ID:",
      property._id.toString()
    );

    console.log(
      "Property:",
      property.title
    );

    console.log(
      "Viewing Fee:",
      amount
    );

    console.log(
      "Status:",
      payment.status
    );

    console.log(
      "================================="
    );

    // =================================================
    // INITIATE STK PUSH
    // =================================================
    //
    // IMPORTANT:
    // There is no global payment lock here.
    //
    // If:
    //
    // Customer A -> initiatePayment()
    // Customer B -> initiatePayment()
    // Customer C -> initiatePayment()
    //
    // Node.js can process all three independently.
    // =================================================

    try {
      const stkResponse =
        await initiateSTKPush({
          phoneNumber:
            normalizedPhone,

          amount,

          accountReference:
            `PROPERTY-${property._id}`,

          transactionDescription:
            "Property Viewing Fee",
        });

      // =================================================
      // VALIDATE SAFARICOM RESPONSE
      // =================================================

      if (
        !stkResponse?.MerchantRequestID ||
        !stkResponse?.CheckoutRequestID
      ) {
        throw new Error(
          "M-Pesa did not return valid transaction identifiers"
        );
      }

      // =================================================
      // UPDATE ONLY THIS PAYMENT
      // =================================================

      const updatedPayment =
        await Payment.findByIdAndUpdate(
          payment._id,
          {
            $set: {
              merchantRequestId:
                stkResponse.MerchantRequestID,

              checkoutRequestId:
                stkResponse.CheckoutRequestID,

              status: "pending",
            },
          },
          {
            new: true,
          }
        );

      if (!updatedPayment) {
        throw new Error(
          "Payment record could not be updated"
        );
      }

      // =================================================
      // LOG
      // =================================================

      console.log(
        "================================="
      );

      console.log(
        "========== STK PUSH ACCEPTED =========="
      );

      console.log(
        "Payment ID:",
        updatedPayment._id.toString()
      );

      console.log(
        "Property ID:",
        property._id.toString()
      );

      console.log(
        "Property:",
        property.title
      );

      console.log(
        "Viewing Fee:",
        amount
      );

      console.log(
        "Merchant Request ID:",
        updatedPayment.merchantRequestId
      );

      console.log(
        "Checkout Request ID:",
        updatedPayment.checkoutRequestId
      );

      console.log(
        "Status:",
        updatedPayment.status
      );

      console.log(
        "================================="
      );

      // =================================================
      // RETURN IMMEDIATELY
      // =================================================

      return res.status(200).json({
        success: true,

        message:
          "M-Pesa payment initiated successfully",

        paymentId:
          updatedPayment._id,

        propertyId:
          property._id,

        amount,

        checkoutRequestId:
          updatedPayment.checkoutRequestId,

        status:
          updatedPayment.status,
      });

    } catch (stkError) {

      // =================================================
      // STK PUSH FAILED
      // =================================================

      console.error(
        "================================="
      );

      console.error(
        "========== STK PUSH FAILED =========="
      );

      console.error(
        "Payment ID:",
        payment._id.toString()
      );

      console.error(
        "Property ID:",
        property._id.toString()
      );

      console.error(
        "Error:",
        stkError.message
      );

      console.error(
        "================================="
      );

      // =================================================
      // MARK ONLY THIS PAYMENT FAILED
      // =================================================

      await Payment.findByIdAndUpdate(
        payment._id,
        {
          $set: {
            status: "failed",

            resultCode: -1,

            resultDescription:
              stkError.message ||
              "Failed to initiate M-Pesa STK Push",
          },
        }
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to initiate M-Pesa payment",

        error:
          stkError.message,

        paymentId:
          payment._id,
      });
    }

  } catch (error) {

    // =================================================
    // GENERAL ERROR
    // =================================================

    console.error(
      "================================="
    );

    console.error(
      "========== INITIATE PAYMENT ERROR =========="
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to initiate M-Pesa payment",

      error:
        error.message,
    });
  }
};

// =====================================================
// M-PESA CALLBACK
// =====================================================

export const mpesaCallback = async (
  req,
  res
) => {
  try {
    console.log("\n=================================");
    console.log("========== MPESA CALLBACK ==========");
    console.log("=================================");

    console.log(
      "Callback received:",
      JSON.stringify(
        req.body,
        null,
        2
      )
    );

    // =================================================
    // EXTRACT CALLBACK
    // =================================================

    const stkCallback =
      req.body?.Body?.stkCallback;

    if (!stkCallback) {
      console.error(
        "Invalid M-Pesa callback"
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc:
          "Callback received",
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

    // =================================================
    // VALIDATE CHECKOUT REQUEST ID
    // =================================================

    if (!CheckoutRequestID) {
      console.error(
        "Missing CheckoutRequestID"
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc:
          "Callback received",
      });
    }

    // =================================================
    // FIND PAYMENT BY ITS OWN CHECKOUT ID
    // =================================================
    //
    // This is VERY important for simultaneous payments.
    //
    // NEVER use:
    //
    // Payment.findOne({ status: "pending" })
    //
    // because that could update the wrong customer's
    // payment.
    //
    // Each Safaricom callback identifies exactly one
    // payment through CheckoutRequestID.
    // =================================================

    const payment =
      await Payment.findOne({
        checkoutRequestId:
          CheckoutRequestID,
      });

    if (!payment) {
      console.error(
        "Payment not found for CheckoutRequestID:",
        CheckoutRequestID
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc:
          "Callback received",
      });
    }

    console.log(
      "Payment found:",
      payment._id.toString()
    );

    // =================================================
    // EXTRACT M-PESA METADATA
    // =================================================

    const items =
      CallbackMetadata?.Item || [];

    const getMetadataValue = (
      name
    ) => {
      const item =
        items.find(
          (item) =>
            item.Name === name
        );

      return item?.Value;
    };

    const mpesaReceiptNumber =
      getMetadataValue(
        "MpesaReceiptNumber"
      ) || null;

    const transactionDate =
      getMetadataValue(
        "TransactionDate"
      )
        ?.toString() || null;

    // =================================================
    // PAYMENT SUCCESS
    // =================================================

    if (Number(ResultCode) === 0) {

      console.log(
        "========== PAYMENT SUCCESS =========="
      );

      // ===============================================
      // GENERATE ACCESS TOKEN
      // ===============================================

      const accessToken =
        payment.accessToken ||
        crypto
          .randomBytes(32)
          .toString("hex");

      // ===============================================
      // ATOMIC UPDATE
      // ===============================================

      await Payment.findOneAndUpdate(
        {
          checkoutRequestId:
            CheckoutRequestID,
        },

        {
          $set: {
            merchantRequestId:
              MerchantRequestID,

            resultCode:
              Number(ResultCode),

            resultDescription:
              ResultDesc,

            status:
              "completed",

            accessToken,

            mpesaReceiptNumber,

            transactionDate,
          },
        },

        {
          new: true,
        }
      );

      console.log(
        "Payment completed:",
        payment._id.toString()
      );

      console.log(
        "M-Pesa Receipt:",
        mpesaReceiptNumber
      );

      console.log(
        "Transaction Date:",
        transactionDate
      );

      console.log(
        "Access Token Generated:",
        Boolean(accessToken)
      );

    } else {

      // =================================================
      // PAYMENT FAILED
      // =================================================

      console.log(
        "========== PAYMENT FAILED =========="
      );

      console.log(
        "Payment ID:",
        payment._id.toString()
      );

      console.log(
        "Result Code:",
        ResultCode
      );

      console.log(
        "Reason:",
        ResultDesc
      );

      // ===============================================
      // ATOMIC UPDATE
      // ===============================================

      await Payment.findOneAndUpdate(
        {
          checkoutRequestId:
            CheckoutRequestID,
        },

        {
          $set: {
            merchantRequestId:
              MerchantRequestID,

            resultCode:
              Number(ResultCode),

            resultDescription:
              ResultDesc,

            status:
              "failed",
          },
        },

        {
          new: true,
        }
      );
    }

    console.log(
      "Payment callback processed"
    );

    console.log(
      "Checkout Request ID:",
      CheckoutRequestID
    );

    console.log(
      "=================================\n"
    );

    // =================================================
    // ACKNOWLEDGE SAFARICOM
    // =================================================

    return res.status(200).json({
      ResultCode: 0,

      ResultDesc:
        "Callback processed successfully",
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "========== CALLBACK ERROR =========="
    );

    console.error(error);

    console.error(
      "================================="
    );

    // =================================================
    // ALWAYS ACKNOWLEDGE CALLBACK
    // =================================================

    return res.status(200).json({
      ResultCode: 0,

      ResultDesc:
        "Callback received",
    });
  }
};

// =====================================================
// CHECK PAYMENT STATUS
// =====================================================

export const checkPaymentStatus = async (
  req,
  res
) => {
  try {
    const { paymentId } =
      req.params;

    // =================================================
    // FIND THIS PAYMENT ONLY
    // =================================================

    const payment =
      await Payment.findById(
        paymentId
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found",
      });
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      payment: {
        id:
          payment._id,

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

        // Only expose after successful payment
        accessToken:
          payment.status ===
          "completed"
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

      error:
        error.message,
    });
  }
};