import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("Lỗi kết nối hệ thống VinSport:", error.message);
    return Promise.reject(error);
  }
);

export default api;