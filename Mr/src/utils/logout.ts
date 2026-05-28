import { removeToken } from "./token";
import { mrClient } from "../services/api";

export const logout = async () => {
  try {
    const profileResponse = await mrClient.get("/profile");
    const isOnline = profileResponse.data?.data?.isOnline;

    if (isOnline) {
      await mrClient.patch("/toggle-online");
    }
  } catch {
    // Logout should still complete if the online status sync fails.
  } finally {
    removeToken();
    window.location.href = "/login";
  }
};
