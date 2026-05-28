/**
 * @author Aman kumar singh
 * @description Cashfree KYC Service (Production Ready)
 */

import axios from "axios";

// Production ke liye hamesha 'api.cashfree.com' base URL rahega
const BASE_URL = process.env.CASHFREE_BASE_URL || "https://api.cashfree.com";

// ENV SAFETY CHECK 
if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_SECRET) {
  throw new Error("Cashfree credentials missing in .env file");
}

//  DYNAMIC HEADERS (FIXED) 
const getHeaders = () => ({
  "x-client-id": process.env.CASHFREE_CLIENT_ID!,
  
  // Production 'Secure ID' APIs hamesha 'x-client-secret' expect karti hain
  "x-client-secret": process.env.CASHFREE_SECRET!, 
  
  "x-api-version": process.env.CASHFREE_API_VERSION || "2022-09-01",
  "Content-Type": "application/json",
});

//  COMMON RESPONSE HANDLER 
const handleResponse = (data: any, defaultMsg: string) => {
  if (!data) throw new Error(defaultMsg);

  // FAILED status check (Cashfree errors aksar 'status' field mein aate hain)
  if (data.status && data.status === "FAILED") {
    throw new Error(data.message || defaultMsg);
  }

  return data;
};

//  AADHAAR OTP GENERATE 
export const generateAadhaarOtp = async (aadhaar: string) => {
  try {
    const url = `${BASE_URL}/verification/offline-aadhaar/otp`;
    const payload = { aadhaar_number: aadhaar };

    console.log("AADHAAR OTP REQUEST:", { url, payload });

    const { data } = await axios.post(url, payload, {
      headers: getHeaders(),
    });

    console.log("AADHAAR OTP RESPONSE:", data);
    return handleResponse(data, "Aadhaar OTP request failed");
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Aadhaar OTP failed";
    console.error("AADHAAR OTP ERROR:", err.response?.data || err.message);
    throw new Error(errorMsg);
  }
};

//  AADHAAR OTP VERIFY 
export const verifyAadhaarOtp = async (ref_id: string, otp: string) => {
  try {
    const url = `${BASE_URL}/verification/offline-aadhaar/verify`;
    const payload = { ref_id, otp };

    console.log("AADHAAR VERIFY REQUEST:", { url, payload });

    const { data } = await axios.post(url, payload, {
      headers: getHeaders(),
    });

    console.log("AADHAAR VERIFY RESPONSE:", data);
    return handleResponse(data, "Aadhaar verification failed");
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Aadhaar verify failed";
    console.error("AADHAAR VERIFY ERROR:", err.response?.data || err.message);
    throw new Error(errorMsg);
  }
};

//  PAN VERIFICATION 
export const verifyPanApi = async (pan: string, name: string) => {
  try {
    const url = `${BASE_URL}/verification/pan`;
    const payload = { pan, name };

    console.log("PAN REQUEST:", payload);

    const { data } = await axios.post(url, payload, {
      headers: getHeaders(),
    });

    console.log("PAN RESPONSE:", data);
    return handleResponse(data, "PAN verification failed");
  } catch (err: any) {
    console.error("PAN ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "PAN failed");
  }
};

//  BANK ACCOUNT VERIFY 
export const verifyBankApi = async (
  account: string,
  ifsc: string,
  name: string,
  phone: string
) => {
  try {
    const url = `${BASE_URL}/verification/bank-account/sync`;
    const payload = {
      bank_account: account,
      ifsc,
      name,
      phone,
    };

    console.log("BANK REQUEST:", payload);

    const { data } = await axios.post(url, payload, {
      headers: getHeaders(),
    });

    console.log("BANK RESPONSE:", data);
    return handleResponse(data, "Bank verification failed");
  } catch (err: any) {
    console.error("BANK ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Bank verification failed");
  }
};