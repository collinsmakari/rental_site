import axios from "axios";

const getMpesaAccessToken = async () => {
  try {
    const consumerKey =
      process.env.MPESA_CONSUMER_KEY?.trim();

    const consumerSecret =
      process.env.MPESA_CONSUMER_SECRET?.trim();

    if (!consumerKey || !consumerSecret) {
      throw new Error(
        "M-Pesa Consumer Key or Consumer Secret is missing"
      );
    }

    console.log("========== MPESA TOKEN DEBUG ==========");
    console.log(
      "Consumer Key exists:",
      Boolean(consumerKey)
    );
    console.log(
      "Consumer Key length:",
      consumerKey.length
    );
    console.log(
      "Consumer Secret exists:",
      Boolean(consumerSecret)
    );
    console.log(
      "Consumer Secret length:",
      consumerSecret.length
    );
    console.log("=======================================");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },

        headers: {
          Accept: "application/json",
        },

        timeout: 30000,
      }
    );

    console.log(
      "M-Pesa token response status:",
      response.status
    );

    console.log(
      "Token received:",
      Boolean(response.data?.access_token)
    );

    console.log(
      "Token length:",
      response.data?.access_token?.length
    );

    console.log(
      "Token expires in:",
      response.data?.expires_in
    );

    const accessToken =
      response.data?.access_token?.trim();

    if (!accessToken) {
      throw new Error(
        "M-Pesa did not return an access token"
      );
    }

    return accessToken;

  } catch (error) {
    console.error(
      "========== MPESA TOKEN ERROR =========="
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
      "======================================="
    );

    throw error;
  }
};

export default getMpesaAccessToken;