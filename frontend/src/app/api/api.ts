import axios from 'axios';

// Khởi tạo một phiên bản Axios
const api = axios.create({
  // THAY ĐỔI QUAN TRỌNG: Lấy link từ file .env thay vì viết cứng
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
});

// Thiết lập "màng lọc" xử lý dữ liệu trả về
api.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ lấy phần dữ liệu lõi
  },
  (error) => {
    console.error("Lỗi kết nối hệ thống VinSport:", error.message);
    return Promise.reject(error);
  }
);

export default api; // Xuất ra với tên 'api' để dùng bên Products.tsx cho tiện