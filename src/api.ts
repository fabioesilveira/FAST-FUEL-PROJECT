import axios from "axios";

export function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("authUser");
  localStorage.removeItem("idUser");
  localStorage.removeItem("userName");
  localStorage.removeItem("userType");
  localStorage.removeItem("emailUser");
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// logout automatico se token expirar / for invalido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = String(error.response?.data?.msg || "").toLowerCase();

    const isExpiredOrInvalidToken =
      status === 401 &&
      (
        msg.includes("jwt expired") ||
        msg.includes("invalid token") ||
        msg.includes("token expired") ||
        msg.includes("unauthorized")
      );

    if (isExpiredOrInvalidToken) {
      clearAuthStorage();

      if (!window.location.pathname.includes("/sign-in")) {
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);