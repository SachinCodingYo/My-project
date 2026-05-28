import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getToken } from "../utils/token";
import { logout } from "../utils/logout";

// Helper: decide base URL dynamically
const getBaseURL = (path: string) => {
  // If you're on localhost (desktop dev), keep localhost
  // Otherwise, use your LAN IP for mobile testing
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const host = isLocalhost ? "http://localhost:5000" : "http://192.168.1.10:5000";
  return `${host}${path}`;
};

// 🔹 AUTH CLIENT (login, forgot password etc.)
export const apiAuthClient = axios.create({
  baseURL: getBaseURL("/api/v1/auth/"),
});

// 🔹 PROTECTED CLIENT (after login)
export const apiClient = axios.create({
  baseURL: getBaseURL("/api/v1/admin/"),
});

export const apiRedFlagClient = axios.create({
  baseURL: getBaseURL("/api/v1/red-flag/"),
});

// Attach headers for protected APIs
const serverHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  config.headers["User-Type"] = "Admin";

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
};

const handle401Error = (error: AxiosError) => {
  if (error.response?.status === 401) {
    logout();
  }
  return Promise.reject(error);
};

apiClient.interceptors.request.use(serverHeaders);
apiClient.interceptors.response.use(
  (response) => response,
  handle401Error
);
apiRedFlagClient.interceptors.request.use(serverHeaders);
apiRedFlagClient.interceptors.response.use(
  (response) => response,
  handle401Error
);

export default apiClient;

// Saurav
// enable when only go for production above code is also work on mobile on same wifi for that

// import axios, {
//   type AxiosError,
//   type InternalAxiosRequestConfig,
// } from "axios";
// import { getToken } from "../utils/token";
// import { logout } from "../utils/logout";

// // 🔹 AUTH CLIENT (login, forgot password etc.)
// export const apiAuthClient = axios.create({
//   baseURL: "http://localhost:5000/api/v1/auth/",
// });

// // 🔹 PROTECTED CLIENT (after login)
// export const apiClient = axios.create({
//   baseURL: "http://localhost:5000/api/v1/admin/",
// });

// // Attach headers for protected APIs
// const serverHeaders = (
//   config: InternalAxiosRequestConfig
// ): InternalAxiosRequestConfig => {
//   config.headers["User-Type"] = "Admin"; // IMPORTANT

//   const token = getToken();

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     // config.headers["Content-Type"] = "application/json";
//   }
//   if (!(config.data instanceof FormData)) {
//   config.headers["Content-Type"] = "application/json";
// }

//   return config;
// };

// const handle401Error = (error: AxiosError) => {
//   if (error.response?.status === 401) {
//     logout();
//   }
//   return Promise.reject(error);
// };

// apiClient.interceptors.request.use(serverHeaders);
// apiClient.interceptors.response.use(
//   (response) => response,
//   handle401Error
// );

// export default apiClient;
