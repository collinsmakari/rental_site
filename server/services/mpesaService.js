import axios from "axios";
import getMpesaAccessToken from "../utils/mpesa.js";

export const initiateSTKPush = async ({
  phoneNumber,
  amount,
  accountReference,
  transactionDescription,
}) => {
  try {
    // ==========================================
    // GET ACCESS TOKEN
    // ==========================================
    const accessToken = await getMpesaAccessToken();

    if (!accessToken) {
      throw new Error("M-Pesa access token was not received");
    }

    console.log("M-Pesa access token obtained");
    console.log("Access token type:", typeof accessToken);
    console.log("Access token length:", accessToken.length);

    // ==========================================
    // M-PESA CONFIGURATION
    // ==========================================
    const shortCode = process.env.MPESA_SHORTCODE?.trim();
    const passKey = process.env.MPESA_PASSKEY?.trim();
    const callbackUrl = process.env.MPESA_CALLBACK_URL?.trim();

    console.log("========== MPESA CONFIG ==========");
    console.log("Shortcode:", shortCode);
    console.log("Passkey exists:", Boolean(passKey));
    console.log("Callback URL:", callbackUrl);
    console.log("==================================");

    if (!shortCode) {
      throw new Error("MPESA_SHORTCODE is missing");
    }

    if (!passKey) {
      throw new Error("MPESA_PASSKEY is missing");
    }

    if (!callbackUrl) {
      throw new Error("MPESA_CALLBACK_URL is missing");
    }

    // ==========================================
    // TIMESTAMP
    // ==========================================
    const date = new Date();

    const timestamp =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0");

    // ==========================================
    // PASSWORD
    // ==========================================
    const password = Buffer.from(
      `${shortCode}${passKey}${timestamp}`
    ).toString("base64");

    // ==========================================
    // FORMAT PHONE NUMBER
    // ==========================================
    let formattedPhone = phoneNumber
      .toString()
      .trim();

    if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (formattedPhone.startsWith("0")) {
      formattedPhone =
        "254" + formattedPhone.substring(1);
    }

    if (!/^2547\d{8}$/.test(formattedPhone)) {
      throw new Error(
        `Invalid Kenyan phone number: ${formattedPhone}`
      );
    }

    // ==========================================
    // FORMAT AMOUNT
    // ==========================================
    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      throw new Error(
        `Invalid payment amount: ${amount}`
      );
    }

    // ==========================================
    // STK REQUEST BODY
    // ==========================================
    const requestBody = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(paymentAmount),
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference:
        accountReference || "PROPERTY",
      TransactionDesc:
        transactionDescription ||
        "Property viewing fee",
    };

    // ==========================================
    // DEBUG
    // ==========================================
    console.log("=================================");
    console.log("========== STK PUSH REQUEST ==========");
    console.log(
      "Endpoint:",
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    );
    console.log("Shortcode:", shortCode);
    console.log("Phone:", formattedPhone);
    console.log("Amount:", paymentAmount);
    console.log("Timestamp:", timestamp);
    console.log("Callback URL:", callbackUrl);
    console.log("Account Reference:", requestBody.AccountReference);
    console.log(
      "Transaction Description:",
      requestBody.TransactionDesc
    );
    console.log(
      "Authorization:",
      `Bearer ${accessToken.substring(0, 8)}...`
    );
    console.log("=================================");

    // ==========================================
    // STK PUSH
    // ==========================================
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        timeout: 30000,
      }
    );

    // ==========================================
    // SUCCESS
    // ==========================================
    console.log("=================================");
    console.log("========== STK PUSH SUCCESS ==========");
    console.log(
      JSON.stringify(response.data, null, 2)
    );
    console.log("=================================");

    return response.data;

  } catch (error) {
    console.error("=================================");
    console.error("========== STK PUSH ERROR ==========");
    console.error("=================================");

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
          Authorization: error.config?.headers?.Authorization
            ? "Bearer [HIDDEN]"
            : undefined,
        }
      );
    }

    console.error("=================================");

    throw error;
  }
};