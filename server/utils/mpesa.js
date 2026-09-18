import axios from "axios";

// =====================================================
// M-PESA OAUTH CONFIGURATION
// =====================================================

const MPESA_TOKEN_URL =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

// =====================================================
// TOKEN CACHE
// =====================================================
//
// Access tokens are reusable for their lifetime.
//
// These variables contain ONLY OAuth information.
// They do NOT contain:
// - payment ID
// - phone number
// - amount
// - property ID
// - checkout request ID
//
// Therefore they are safe to share between concurrent
// payment requests.
// =====================================================

let cachedAccessToken = null;
let tokenExpiresAt = 0;

// =====================================================
// IN-FLIGHT TOKEN REQUEST
// =====================================================
//
// If several customers request a token at exactly the
// same time, they can share ONE OAuth request.
//
// Example:
//
// Customer A ─┐
// Customer B ─┼──> same OAuth request
// Customer C ─┘
//
// After the token is received, all three STK requests
// continue independently.
// =====================================================

let tokenPromise = null;

// =====================================================
// GET M-PESA ACCESS TOKEN
// =====================================================

const getMpesaAccessToken = async () => {
  try {
    // =================================================
    // RETURN CACHED TOKEN
    // =================================================
    //
    // Keep a small safety margin so we don't use a token
    // that is about to expire.
    // =================================================

    const now = Date.now();

    if (
      cachedAccessToken &&
      now < tokenExpiresAt
    ) {
      console.log(
        "Using cached M-Pesa access token"
      );

      return cachedAccessToken;
    }

    // =================================================
    // TOKEN REQUEST ALREADY IN PROGRESS
    // =================================================
    //
    // If another request is already obtaining a token,
    // wait for that same request instead of creating
    // another OAuth request.
    // =================================================

    if (tokenPromise) {
      console.log(
        "Waiting for existing M-Pesa token request"
      );

      return await tokenPromise;
    }

    // =================================================
    // READ CREDENTIALS
    // =================================================

    const consumerKey =
      process.env.MPESA_CONSUMER_KEY?.trim();

    const consumerSecret =
      process.env.MPESA_CONSUMER_SECRET?.trim();

    if (
      !consumerKey ||
      !consumerSecret
    ) {
      throw new Error(
        "M-Pesa Consumer Key or Consumer Secret is missing"
      );
    }

    // =================================================
    // TOKEN REQUEST
    // =================================================

    tokenPromise = axios
      .get(
        MPESA_TOKEN_URL,
        {
          auth: {
            username:
              consumerKey,

            password:
              consumerSecret,
          },

          headers: {
            Accept:
              "application/json",
          },

          timeout: 30000,
        }
      )
      .then((response) => {

        // =============================================
        // RESPONSE DEBUG
        // =============================================

        console.log(
          "M-Pesa token response status:",
          response.status
        );

        console.log(
          "Token received:",
          Boolean(
            response.data?.access_token
          )
        );

        console.log(
          "Token length:",
          response.data
            ?.access_token
            ?.length
        );

        console.log(
          "Token expires in:",
          response.data?.expires_in
        );

        // =============================================
        // EXTRACT TOKEN
        // =============================================

        const accessToken =
          response.data
            ?.access_token
            ?.trim();

        if (!accessToken) {
          throw new Error(
            "M-Pesa did not return an access token"
          );
        }

        // =============================================
        // TOKEN EXPIRATION
        // =============================================
        //
        // expires_in is normally returned in seconds.
        //
        // We subtract 60 seconds as a safety margin.
        // =============================================

        const expiresInSeconds =
          Number(
            response.data?.expires_in
          ) || 3599;

        const safetyMargin =
          60 * 1000;

        cachedAccessToken =
          accessToken;

        tokenExpiresAt =
          Date.now() +
          Math.max(
            0,
            expiresInSeconds *
              1000 -
              safetyMargin
          );

        console.log(
          "M-Pesa access token cached"
        );

        console.log(
          "Token cache valid until:",
          new Date(
            tokenExpiresAt
          ).toISOString()
        );

        return accessToken;
      })
      .finally(() => {
        // =============================================
        // CLEAR IN-FLIGHT REQUEST
        // =============================================
        //
        // Future requests will use the cached token.
        // If this request failed, a future request can
        // try again.
        // =============================================

        tokenPromise = null;
      });

    return await tokenPromise;

  } catch (error) {

    // =================================================
    // TOKEN ERROR
    // =================================================

    console.error(
      "================================="
    );

    console.error(
      "========== MPESA TOKEN ERROR =========="
    );

    console.error(
      "================================="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "HTTP status:",
      error.response?.status
    );

    console.error(
      "Response:",
      error.response?.data
    );

    console.error(
      "================================="
    );

    throw error;
  }
};

export default getMpesaAccessToken;