import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "../utils/token";

const getHost = () => {
  const currentHost = window.location.hostname;
  const isLocalhost = currentHost === "localhost" || currentHost === "127.0.0.1";
  return isLocalhost ? "http://localhost:5000" : `http://${currentHost}:5000`;
};

const attachToken = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
};

const handle401 = (error: AxiosError) => {
  if (error.response?.status === 401) {
    removeToken();
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

export const authClient = axios.create({
  baseURL: `${getHost()}/api/v1/auth`,
});

export const userClient = axios.create({
  baseURL: `${getHost()}/api/v1/user`,
});

export const mrClient = axios.create({
  baseURL: `${getHost()}/api/v1/mr`,
});

export const orderClient = axios.create({
  baseURL: `${getHost()}/api/v1/orders`,
});

export const kycClient = axios.create({
  baseURL: `${getHost()}/api/v1/kyc`,
});

export const notificationClient = axios.create({
  baseURL: `${getHost()}/api/v1/notifications`,
});

authClient.interceptors.response.use((response) => response, handle401);
userClient.interceptors.request.use(attachToken);
userClient.interceptors.response.use((response) => response, handle401);
mrClient.interceptors.request.use(attachToken);
mrClient.interceptors.response.use((response) => response, handle401);
orderClient.interceptors.request.use(attachToken);
orderClient.interceptors.response.use((response) => response, handle401);
kycClient.interceptors.request.use(attachToken);
kycClient.interceptors.response.use((response) => response, handle401);
notificationClient.interceptors.request.use(attachToken);
notificationClient.interceptors.response.use((response) => response, handle401);
