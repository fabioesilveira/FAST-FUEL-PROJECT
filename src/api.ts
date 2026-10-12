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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || "");
    const token = localStorage.getItem("token");

    const isLoginRequest = requestUrl.includes("/users/login");

    if (status === 401 && token && !isLoginRequest) {
      clearAuthStorage();

      if (
        !window.location.pathname.includes("/session-expired") &&
        !window.location.pathname.includes("/sign-in")
      ) {
        window.location.href = "/session-expired";
      }
    }

    return Promise.reject(error);
  }
);