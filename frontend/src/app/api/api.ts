import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vinsport_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Lỗi kết nối hệ thống VinSport:", error.message);

    if (error?.response?.status === 401) {
      localStorage.removeItem("vinsport_token");
      localStorage.removeItem("vinsport_user");
    }

    return Promise.reject(error);
  }
);

export default api;