import axios from "axios";

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

// logout automático se token expirar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // limpa sessão
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");

      // evita loop infinito se já estiver no login
      if (!window.location.pathname.includes("/sign-in")) {
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);
