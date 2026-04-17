import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Zap, Shield, Truck, Loader2 } from "lucide-react";
import api from "../api/api";
import { MOCK_PRODUCTS } from "../data/mockData";
import { ProductCard } from "../components/ProductCard";

export const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const data: any = await api.get("/products");
        console.log("%c✅ HOME: BACKEND CONNECTED", "color: green; font-weight: bold;");
        setProducts(data);
      } catch (error) {
        console.error("%c❌ HOME: BACKEND ERROR", "color: red; font-weight: bold;");
        if (import.meta.env.VITE_USE_MOCK === "true") {
          console.warn("Using Mock Data for Home");
          setProducts(MOCK_PRODUCTS);
        } else {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  const popularProducts = products.slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-lg">Đang tải dữ liệu VinSport...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 bg-orange-600 text-xs font-bold rounded-full mb-4 tracking-wider uppercase">Bộ sưu tập 2026</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">CHINH PHỤC <br/><span className="text-orange-500">MỌI GIỚI HẠN</span></h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl">
              Khám phá các thiết bị thể thao đỉnh cao từ các thương hiệu hàng đầu thế giới. Nâng tầm hiệu suất của bạn với VinSport.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full transition-all hover:pr-6 hover:gap-4">
              Mua Sắm Ngay <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-full text-orange-600"><Truck className="w-6 h-6" /></div>
              <div><h3 className="font-bold text-slate-900">Giao hàng toàn quốc</h3><p className="text-sm text-slate-500">Miễn phí cho đơn từ 1.000.000đ</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-full text-orange-600"><Shield className="w-6 h-6" /></div>
              <div><h3 className="font-bold text-slate-900">Chính hãng 100%</h3><p className="text-sm text-slate-500">Đảm bảo nguồn gốc xuất xứ</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-full text-orange-600"><Zap className="w-6 h-6" /></div>
              <div><h3 className="font-bold text-slate-900">Đổi trả dễ dàng</h3><p className="text-sm text-slate-500">Trong vòng 30 ngày</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div><h2 className="text-3xl font-black text-slate-900 mb-2">HÀNG MỚI VỀ</h2><p className="text-slate-500">Cập nhật những xu hướng thể thao mới nhất</p></div>
            <Link to="/products" className="text-orange-600 font-medium hover:underline hidden sm:block">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-black text-slate-900 mb-2">SẢN PHẨM NỔI BẬT</h2><div className="w-24 h-1 bg-orange-600 mx-auto rounded"></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/products?category=Giày" className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" alt="Giày" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8 text-white"><h3 className="text-3xl font-black mb-2">GIÀY THỂ THAO</h3><span className="inline-flex items-center gap-2 font-medium group-hover:text-orange-400">Khám phá ngay <ArrowRight className="w-4 h-4" /></span></div>
            </Link>
            <Link to="/products?category=Áo" className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" alt="Áo" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8 text-white"><h3 className="text-3xl font-black mb-2">THỜI TRANG THỂ THAO</h3><span className="inline-flex items-center gap-2 font-medium group-hover:text-orange-400">Khám phá ngay <ArrowRight className="w-4 h-4" /></span></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};