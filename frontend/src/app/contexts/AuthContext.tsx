import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../api/api";

type User = {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("vinsport_user");
    const savedToken = localStorage.getItem("vinsport_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("vinsport_user");
        localStorage.removeItem("vinsport_token");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: any = await api.post("/login", { email, password });

      setUser(response.user);
      localStorage.setItem("vinsport_token", response.token);
      localStorage.setItem("vinsport_user", JSON.stringify(response.user));

      console.log("%c✅ ĐĂNG NHẬP THÀNH CÔNG", "color: green; font-weight: bold;");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mockUser = { name: "Khách hàng Demo", email };
        setUser(mockUser);
        localStorage.setItem("vinsport_token", "mock-token");
        localStorage.setItem("vinsport_user", JSON.stringify(mockUser));
      } else {
        throw new Error("Tài khoản hoặc mật khẩu không chính xác");
      }
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string = "",
    address: string = ""
  ) => {
    try {
      const response: any = await api.post("/register", {
        name,
        email,
        password,
        phone,
        address,
      });

      setUser(response.user);
      localStorage.setItem("vinsport_token", response.token);
      localStorage.setItem("vinsport_user", JSON.stringify(response.user));

      console.log("%c✅ ĐĂNG KÝ THÀNH CÔNG", "color: green; font-weight: bold;");
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);

      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mockUser = { name, email };
        setUser(mockUser);
        localStorage.setItem("vinsport_token", "mock-token");
        localStorage.setItem("vinsport_user", JSON.stringify(mockUser));
      } else {
        throw new Error(
          error?.response?.data?.message || "Không thể đăng ký tài khoản"
        );
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vinsport_token");
    localStorage.removeItem("vinsport_user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};