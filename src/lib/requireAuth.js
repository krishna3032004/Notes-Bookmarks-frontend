import { getToken } from "./auth";

export const requireAuth = () => {
  const token = getToken();
  if (!token) {
    window.location.href = "/auth/login";
  }
};
