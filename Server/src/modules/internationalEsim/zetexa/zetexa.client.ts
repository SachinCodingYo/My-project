import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getZetexaToken } from "./zetexa.auth";

const ZETEXA_BASE_URL = process.env.ZETEXA_BASE_URL;
const ZETEXA_ACCESS_TOKEN = process.env.ZETEXA_ACCESS_TOKEN!;

// ─── Create Axios Instance ─────────────────────────────────────────────────────

const zetexaClient: AxiosInstance = axios.create({
  baseURL: ZETEXA_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000, // 15 seconds — Zetexa can be slow
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before EVERY request — attaches fresh tokens automatically

zetexaClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getZetexaToken();

    config.headers["AccessToken"] = ZETEXA_ACCESS_TOKEN;
    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after EVERY response — normalizes errors

zetexaClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: false; message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      console.error(
        "[ZetexaClient] Unauthorized — JWT may be invalid:",
        message,
      );
    } else if (status === 403) {
      console.error(
        "[ZetexaClient] Forbidden — AccessToken may be wrong:",
        message,
      );
    } else {
      console.error(`[ZetexaClient] Error ${status}:`, message);
    }
    return Promise.reject(new Error(`Zetexa API error: ${message}`));
  },
);

export default zetexaClient;
