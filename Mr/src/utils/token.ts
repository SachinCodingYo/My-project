import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../common/types/types";

const TOKEN_KEY = "mrAccessToken";

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    sameSite: "lax",
    secure: import.meta.env.PROD,
  });
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};
