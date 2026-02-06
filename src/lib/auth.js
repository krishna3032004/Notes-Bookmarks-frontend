export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/auth/login";
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user"));
};
