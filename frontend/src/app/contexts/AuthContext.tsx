import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../api/api";

type User = {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
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

function normalizeUser(rawUser: any): User {
  return {
    id: rawUser?.id,
    name: rawUser?.name || "Người dùng",
    email: rawUser?.email || "",
    phone: rawUser?.phone || "",
    address: rawUser?.address || "",
    role: rawUser?.role || "user",
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("vinsport_user");
    const savedToken = localStorage.getItem("vinsport_token");

    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(normalizeUser(parsed));
      } catch {
        localStorage.removeItem("vinsport_user");
        localStorage.removeItem("vinsport_token");
      }
    }

    setIsAuthLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: any = await api.post("/login", { email, password });

      if (!response?.user || !response?.token) {
        throw new Error("Backend login chưa trả đủ user/token");
      }

      const normalizedUser = normalizeUser(response.user);

      setUser(normalizedUser);
      localStorage.setItem("vinsport_token", response.token);
      localStorage.setItem("vinsport_user", JSON.stringify(normalizedUser));
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);

      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mockUser = normalizeUser({
          name: "Khách hàng Demo",
          email,
          role: "user",
        });

        setUser(mockUser);
        localStorage.setItem("vinsport_token", "mock-token");
        localStorage.setItem("vinsport_user", JSON.stringify(mockUser));
      } else {
        throw new Error(
          error?.response?.data?.message ||
            error?.message ||
            "Tài khoản hoặc mật khẩu không chính xác"
        );
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

      if (response?.user && response?.token) {
        const normalizedUser = normalizeUser(response.user);

        setUser(normalizedUser);
        localStorage.setItem("vinsport_token", response.token);
        localStorage.setItem("vinsport_user", JSON.stringify(normalizedUser));
        return;
      }

      await login(email, password);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);

      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mockUser = normalizeUser({
          name,
          email,
          phone,
          address,
          role: "user",
        });

        setUser(mockUser);
        localStorage.setItem("vinsport_token", "mock-token");
        localStorage.setItem("vinsport_user", JSON.stringify(mockUser));
      } else {
        throw new Error(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể đăng ký tài khoản"
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
      value={{
        isAuthenticated: !!user,
        isAuthLoading,
        user,
        login,
        register,
        logout,
      }}
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