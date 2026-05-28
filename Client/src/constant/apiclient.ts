//base urls
import axios from "axios";
import { getToken, removeToken } from "../utils/getTocken";
export const apiAuthClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/auth/",
});
export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/user/",
});
export const apiPublicClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/public/",
});
const logout = async () => {
  try {
    await apiClient.post("/admin-auth/logOut/");
  } catch (e) {
    console.log(e);
  } finally {
    removeToken()
    delete apiClient.defaults.headers.common["Authorization"];
    setTimeout(() => window.location.href = "/login", 500)
  }
};
const serverHeaders = (config: any) => {
  config.headers["User-Type"] = "Admin";
  const token = getToken();
  if (token && config.url !== "login/" && config.url !== "verify-otp/") {
    config.headers["Authorization"] = `Bearer ${token}`;
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
  }
  return config;
};
const handle401Error = (error: any) => {
  if (error.response && error.response.status === 401) {
    logout();
  }
  return Promise.reject(error);
};
apiClient.interceptors.request.use(serverHeaders);
apiClient.interceptors.response.use(
  (response) => response,
  handle401Error
);
