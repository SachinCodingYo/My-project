// src/common/utils/logout.ts

import Cookies from "js-cookie";
import apiClient from "../constant/apiclient";

export const logout = (): void => {
  Cookies.remove("accessToken");
  delete apiClient.defaults.headers.common["Authorization"];
  window.location.href = "/signin"; // FIXED
};