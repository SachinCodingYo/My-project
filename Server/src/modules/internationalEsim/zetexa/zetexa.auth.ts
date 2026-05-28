import axios from "axios";
import { ZetexaCreateTokenResponse } from "./zetexa.types";

const ZETEXA_BASE_URL = process.env.ZETEXA_BASE_URL;
const ZETEXA_ACCESS_TOKEN = process.env.ZETEXA_ACCESS_TOKEN!;
const ZETEXA_EMAIL = process.env.ZETEXA_EMAIL!;
const ZETEXA_PASSWORD = process.env.ZETEXA_PASSWORD!;

// ─── In-Memory Cache ──────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiresAt: Date | null = null;

const TOKEN_VALIDITY_DAYS = 10;
const REFRESH_BEFORE_DAYS = 1; // refresh 1 day before expiry

// ─── Core Functions ───────────────────────────────────────────────────────────

const isTokenValid = (): boolean => {
  if (!cachedToken || !tokenExpiresAt) return false;

  const now = new Date();
  const refreshThreshold = new Date(tokenExpiresAt);
  refreshThreshold.setDate(refreshThreshold.getDate() - REFRESH_BEFORE_DAYS);

  // token is valid if we haven't hit the refresh threshold yet
  return now < refreshThreshold;
};

const fetchFreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post<ZetexaCreateTokenResponse>(
      `${ZETEXA_BASE_URL}/v1/Create-Token/`,
      { email: ZETEXA_EMAIL, password: ZETEXA_PASSWORD },
      {
        headers: {
          AccessToken: ZETEXA_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data.success || !response.data.session_token) {
      throw new Error("Zetexa returned success:false on Create-Token");
    }

    // store in cache
    cachedToken = response.data.session_token;
    tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + TOKEN_VALIDITY_DAYS);

    console.log(
      "[ZetexaAuth] Fresh token fetched, valid until:",
      tokenExpiresAt,
    );
    return cachedToken;
  } catch (error: any) {
    console.error(
      "[ZetexaAuth] Failed to fetch token:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to authenticate with Zetexa");
  }
};

// ─── Main Export ──────────────────────────────────────────────────────────────

export const getZetexaToken = async (): Promise<string> => {
  if (isTokenValid()) {
    return cachedToken!;
  }

  console.log(
    "[ZetexaAuth] Token missing or near expiry, fetching fresh token...",
  );
  return fetchFreshToken();
};

// call this on server startup so the first real request doesn't take extra time
export const warmupZetexaAuth = async (): Promise<void> => {
  try {
    await getZetexaToken();
    console.log("[ZetexaAuth] Warmup successful");
  } catch (error) {
    console.error(
      "[ZetexaAuth] Warmup failed — Zetexa credentials may be wrong",
    );
  }
};
