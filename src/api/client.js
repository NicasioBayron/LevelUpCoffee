import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: si existe un token guardado al iniciar sesión, lo adjunta en cada petición
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("levelup.token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);