import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedAdminRoute({ children }: Props) {
  const { user, isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-lg">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white border rounded-2xl p-8 text-center shadow-sm max-w-xl w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-3">
            Không có quyền truy cập
          </h2>
          <p className="text-slate-600">
            Khu vực này chỉ dành cho tài khoản quản trị viên.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}