import axios from "axios";
import getMpesaAccessToken from "../utils/mpesa.js";

const MPESA_STK_URL =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

// =====================================================
// SHARED ACCESS TOKEN REQUEST
// =====================================================
// This is ONLY for preventing multiple simultaneous
// OAuth requests. It is NOT transaction-specific.
//
// Payment A, B, C can still make their STK requests
// simultaneously.
// =====================================================

let tokenPromise = null;

const getAccessTokenSafely = async () => {
  if (!tokenPromise) {
    tokenPromise = getMpesaAccessToken()
      .finally(() => {
        tokenPromise = null;
      });
  }

  return tokenPromise;
};

// =====================================================
// FORMAT KENYAN PHONE NUMBER
// =====================================================

const formatPhoneNumber = (phoneNumber) => {
  let formattedPhone = String(phoneNumber).trim();

  // +254712345678 -> 254712345678
  if (formattedPhone.startsWith("+254")) {
    formattedPhone = formattedPhone.substring(1);
  }

  // 0712345678 -> 254712345678
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "254" + formattedPhone.substring(1);
  }

  // Validate
  if (!/^2547\d{8}$/.test(formattedPhone)) {
    throw new Error(
      `Invalid Kenyan phone number: ${formattedPhone}`
    );
  }

  return formattedPhone;
};

// =====================================================
// CREATE TIMESTAMP
// =====================================================

const generateTimestamp = () => {
  const date = new Date();

  return (
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
};

// =====================================================
// INITIATE STK PUSH
// =====================================================

export const initiateSTKPush = async ({
  phoneNumber,
  amount,
  accountReference,
  transactionDescription,
}) => {
  // ===================================================
  // IMPORTANT:
  // EVERYTHING BELOW IS LOCAL TO THIS PAYMENT REQUEST.
  //
  // If 10 users call this function simultaneously,
  // each request gets its own values.
  // ===================================================

  try {
    // =================================================
    // GET ACCESS TOKEN
    // =================================================

    const accessToken = await getAccessTokenSafely();

    if (!accessToken) {
      throw new Error(
        "M-Pesa access token was not received"
      );
    }

    console.log(
      "M-Pesa access token obtained"
    );

    console.log(
      "Access token type:",
      typeof accessToken
    );

    console.log(
      "Access token length:",
      accessToken.length
    );

    // =================================================
    // MPESA CONFIGURATION
    // =================================================

    const shortCode =
      process.env.MPESA_SHORTCODE?.trim();

    const passKey =
      process.env.MPESA_PASSKEY?.trim();

    const callbackUrl =
      process.env.MPESA_CALLBACK_URL?.trim();

    console.log(
      "========== MPESA CONFIG =========="
    );

    console.log(
      "Shortcode:",
      shortCode
    );

    console.log(
      "Passkey exists:",
      Boolean(passKey)
    );

    console.log(
      "Callback URL:",
      callbackUrl
    );

    console.log(
      "=================================="
    );

    if (!shortCode) {
      throw new Error(
        "MPESA_SHORTCODE is missing"
      );
    }

    if (!passKey) {
      throw new Error(
        "MPESA_PASSKEY is missing"
      );
    }

    if (!callbackUrl) {
      throw new Error(
        "MPESA_CALLBACK_URL is missing"
      );
    }

    // =================================================
    // TIMESTAMP
    // =================================================

    const timestamp = generateTimestamp();

    // =================================================
    // PASSWORD
    // =================================================

    const password = Buffer.from(
      `${shortCode}${passKey}${timestamp}`
    ).toString("base64");

    // =================================================
    // PHONE NUMBER
    // =================================================

    const formattedPhone =
      formatPhoneNumber(phoneNumber);

    // =================================================
    // AMOUNT
    // =================================================

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      throw new Error(
        `Invalid payment amount: ${amount}`
      );
    }

    const finalAmount =
      Math.round(paymentAmount);

    // =================================================
    // ACCOUNT REFERENCE
    // =================================================

    const finalAccountReference =
      accountReference || "PROPERTY";

    // =================================================
    // TRANSACTION DESCRIPTION
    // =================================================

    const finalTransactionDescription =
      transactionDescription ||
      "Property viewing fee";

    // =================================================
    // STK REQUEST BODY
    // =================================================

    const requestBody = {
      BusinessShortCode: shortCode,

      Password: password,

      Timestamp: timestamp,

      TransactionType:
        "CustomerPayBillOnline",

      Amount: finalAmount,

      PartyA: formattedPhone,

      PartyB: shortCode,

      PhoneNumber: formattedPhone,

      CallBackURL: callbackUrl,

      AccountReference:
        finalAccountReference,

      TransactionDesc:
        finalTransactionDescription,
    };

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "========== STK PUSH REQUEST =========="
    );

    console.log(
      "Endpoint:",
      MPESA_STK_URL
    );

    console.log(
      "Phone:",
      formattedPhone
    );

    console.log(
      "Amount:",
      finalAmount
    );

    console.log(
      "Timestamp:",
      timestamp
    );

    console.log(
      "Callback URL:",
      callbackUrl
    );

    console.log(
      "Account Reference:",
      finalAccountReference
    );

    console.log(
      "Transaction Description:",
      finalTransactionDescription
    );

    console.log(
      "Authorization:",
      `Bearer ${accessToken.substring(
        0,
        8
      )}...`
    );

    console.log(
      "================================="
    );

    // =================================================
    // SEND STK PUSH
    // =================================================
    //
    // IMPORTANT:
    // There is NO global queue or lock here.
    //
    // Multiple calls to this function can execute
    // simultaneously.
    // =================================================

    const response = await axios.post(
      MPESA_STK_URL,
      requestBody,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        timeout: 30000,
      }
    );

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "========== STK PUSH SUCCESS =========="
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    console.log(
      "================================="
    );

    return response.data;

  } catch (error) {

    // =================================================
    // ERROR
    // =================================================

    console.error(
      "================================="
    );

    console.error(
      "========== STK PUSH ERROR =========="
    );

    console.error(
      "================================="
    );

    console.error(
      "Message:",
      error.message
    );

    if (error.response) {

      console.error(
        "HTTP Status:",
        error.response.status
      );

      console.error(
        "Safaricom Response:",
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );

      console.error(
        "Request URL:",
        error.config?.url
      );

      console.error(
        "Request Method:",
        error.config?.method
      );

      console.error(
        "Request Headers:",
        {
          ...error.config?.headers,

          Authorization:
            error.config?.headers
              ?.Authorization
              ? "Bearer [HIDDEN]"
              : undefined,
        }
      );
    }

    console.error(
      "================================="
    );

    throw error;
  }
};