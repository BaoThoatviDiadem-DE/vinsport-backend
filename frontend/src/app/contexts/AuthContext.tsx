import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "../api/api"; // Import trạm trung chuyển API

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>; // Chuyển thành async
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // Gửi yêu cầu đăng nhập lên Backend
      const response: any = await api.post("/login", { email, password });
      
      // Giả sử Backend trả về object { user: { name, email }, token: "..." }
      setUser(response.user);
      
      // Lưu token vào máy khách để các lần sau không cần đăng nhập lại
      localStorage.setItem("vinsport_token", response.token);
      
      console.log("%c✅ ĐĂNG NHẬP THÀNH CÔNG", "color: green; font-weight: bold;");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // Fallback: Nếu đang bật Mock mode thì cho đăng nhập giả để em làm tiếp
      if (import.meta.env.VITE_USE_MOCK === "true") {
        setUser({ name: "Khách hàng Demo", email: email });
      } else {
        throw new Error("Tài khoản hoặc mật khẩu không chính xác");
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vinsport_token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};