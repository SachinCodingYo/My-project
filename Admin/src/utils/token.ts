import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken";

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    sameSite: "lax",
    secure: import.meta.env.PROD,
  });
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const getTokenData = (): { id: string; role: string } | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<{ id: string; role: string }>(token);
  } catch {
    return null;
  }
};