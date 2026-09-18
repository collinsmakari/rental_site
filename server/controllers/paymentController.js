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
    // GET VIEWING FEE DIRECTLY FROM MONGODB
    // =================================================

    const amount = Number(property.viewingFee);

    const normalizedPhone =
      String(phoneNumber).trim();

    console.log("=================================");
    console.log("========== PROPERTY PAYMENT ==========");
    console.log("Property ID:", property._id.toString());
    console.log("Property:", property.title);
    console.log(
      "Viewing Fee from MongoDB:",
      property.viewingFee
    );
    console.log(
      "Viewing Fee Type:",
      typeof property.viewingFee
    );
    console.log("Amount sent to M-Pesa:", amount);
    console.log("Phone Number:", normalizedPhone);
    console.log("=================================");

    // =================================================
    // VALIDATE VIEWING FEE
    // =================================================

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "This property does not have a valid viewing fee",
      });
    }

    // =================================================
    // CREATE A NEW PAYMENT
    // =================================================
    //
    // IMPORTANT:
    //
    // Every request creates its OWN payment.
    //
    // We deliberately do NOT search for an existing
    // pending payment.
    //
    // This allows:
    //
    // Customer A -> Payment A -> STK A
    // Customer B -> Payment B -> STK B
    // Customer C -> Payment C -> STK C
    //
    // Even the same customer can intentionally start
    // another transaction.
    // =================================================

    const payment = await Payment.create({
      property: property._id,
      phoneNumber: normalizedPhone,
      amount,
      status: "pending",
    });

    console.log("=================================");
    console.log("========== PAYMENT CREATED ==========");
    console.log("Payment ID:", payment._id.toString());
    console.log(
      "Property ID:",
      property._id.toString()
    );
    console.log("Property:", property.title);
    console.log("Viewing Fee:", amount);
    console.log("Phone:", normalizedPhone);
    console.log("Status:", payment.status);
    console.log("=================================");

    // =================================================
    // INITIATE M-PESA STK PUSH
    // =================================================

    try {
      const stkResponse = await initiateSTKPush({
        phoneNumber: normalizedPhone,

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
        !stkResponse ||
        !stkResponse.MerchantRequestID ||
        !stkResponse.CheckoutRequestID
      ) {
        throw new Error(
          "M-Pesa did not return valid transaction identifiers"
        );
      }

      // =================================================
      // SAVE M-PESA TRANSACTION IDENTIFIERS
      // =================================================
      //
      // Update ONLY the payment created above.
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
      // LOG SUCCESS
      // =================================================

      console.log("=================================");
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

      console.log("=================================");

      // =================================================
      // RETURN RESPONSE TO FRONTEND
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

      console.error("=================================");
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
        "Property:",
        property.title
      );

      console.error(
        "Phone:",
        normalizedPhone
      );

      console.error(
        "Amount:",
        amount
      );

      console.error(
        "Error:",
        stkError.message
      );

      console.error("=================================");

      // =================================================
      // MARK THIS PAYMENT AS FAILED
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

    console.error("=================================");
    console.error(
      "========== INITIATE PAYMENT ERROR =========="
    );
    console.error(error);
    console.error("=================================");

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

export const mpesaCallback = async (req, res) => {
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
    // EXTRACT STK CALLBACK
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
    // FIND THE EXACT PAYMENT
    // =================================================
    //
    // This is the most important part for
    // simultaneous transactions.
    //
    // We NEVER use:
    //
    // Payment.findOne({ status: "pending" })
    //
    // because that could update another customer's
    // payment.
    //
    // Safaricom gives us CheckoutRequestID, so we use
    // that exact identifier.
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

    console.log(
      "Payment property:",
      payment.property.toString()
    );

    console.log(
      "Payment amount:",
      payment.amount
    );

    // =================================================
    // EXTRACT CALLBACK METADATA
    // =================================================

    const items =
      CallbackMetadata?.Item || [];

    const getMetadataValue = (name) => {
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

    const callbackAmount =
      getMetadataValue(
        "Amount"
      );

    const callbackPhoneNumber =
      getMetadataValue(
        "PhoneNumber"
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
      "Callback Amount:",
      callbackAmount
    );

    console.log(
      "Callback Phone:",
      callbackPhoneNumber
    );

    // =================================================
    // SUCCESSFUL PAYMENT
    // =================================================

    if (Number(ResultCode) === 0) {
      console.log(
        "========== PAYMENT SUCCESS =========="
      );

      // =================================================
      // GENERATE PROPERTY ACCESS TOKEN
      // =================================================
      //
      // Every completed payment gets its own token.
      // =================================================

      const accessToken =
        payment.accessToken ||
        crypto
          .randomBytes(32)
          .toString("hex");

      // =================================================
      // ATOMIC PAYMENT UPDATE
      // =================================================

      const updatedPayment =
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

      if (!updatedPayment) {
        console.error(
          "Payment disappeared during callback update:",
          CheckoutRequestID
        );

        return res.status(200).json({
          ResultCode: 0,

          ResultDesc:
            "Callback received",
        });
      }

      console.log(
        "================================="
      );

      console.log(
        "Payment completed successfully"
      );

      console.log(
        "Payment ID:",
        updatedPayment._id.toString()
      );

      console.log(
        "Checkout Request ID:",
        CheckoutRequestID
      );

      console.log(
        "M-Pesa Receipt:",
        updatedPayment.mpesaReceiptNumber
      );

      console.log(
        "Transaction Date:",
        updatedPayment.transactionDate
      );

      console.log(
        "Access Token Generated:",
        Boolean(
          updatedPayment.accessToken
        )
      );

      console.log(
        "Status:",
        updatedPayment.status
      );

      console.log(
        "================================="
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
        "Checkout Request ID:",
        CheckoutRequestID
      );

      console.log(
        "Result Code:",
        ResultCode
      );

      console.log(
        "Reason:",
        ResultDesc
      );

      // =================================================
      // ATOMIC FAILED PAYMENT UPDATE
      // =================================================

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

      console.log(
        "Payment marked as failed"
      );
    }

    console.log(
      "Payment callback processed successfully"
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
    // =================================================
    // CALLBACK ERROR
    // =================================================

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
    // ALWAYS ACKNOWLEDGE SAFARICOM
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
    // VALIDATE PAYMENT ID
    // =================================================

    if (!paymentId) {
      return res.status(400).json({
        success: false,

        message:
          "Payment ID is required",
      });
    }

    // =================================================
    // FIND ONLY THIS PAYMENT
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
    // RETURN PAYMENT STATUS
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

        // Only expose access token after successful
        // payment.
        accessToken:
          payment.status ===
          "completed"
            ? payment.accessToken
            : null,
      },
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "CHECK PAYMENT STATUS ERROR"
    );

    console.error(error);

    console.error(
      "================================="
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