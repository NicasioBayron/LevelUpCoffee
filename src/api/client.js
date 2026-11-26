import axios from "axios";

export const api = axios.create({
  // Mantiene el mismo host que usa el navegador (localhost o 127.0.0.1).
  // En Docker/producción se puede sobrescribir con VITE_API_URL.
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:9090/api`,
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
