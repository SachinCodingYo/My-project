import Cookies from "js-cookie";
const TOKEN_KEY = "accessToken";
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    secure: true,
    sameSite: "strict",
  });
};
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};
export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};
