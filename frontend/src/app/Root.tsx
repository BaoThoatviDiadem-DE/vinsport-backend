import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar"; //
import { Footer } from "./components/Footer"; //
import { CartProvider } from "./contexts/CartContext"; //
import { AuthProvider } from "./contexts/AuthContext"; //
import { Toaster } from 'react-hot-toast'; // Thư viện thông báo xịn

export function Root() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Đặt Toaster ở đây để thông báo hiện lên trên cùng giao diện */}
        <Toaster position="top-center" reverseOrder={false} /> 
        
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}