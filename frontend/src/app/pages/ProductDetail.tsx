import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Check, Truck, Shield, RotateCcw, ChevronLeft, Minus, Plus, Loader2 } from "lucide-react";
import api from "../api/api";
import { MOCK_PRODUCTS, formatPrice } from "../data/mockData";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        const data: any = await api.get(`/products/${id}`);
        console.log(`%c✅ DETAIL: PRODUCT ${id} LOADED`, "color: green; font-weight: bold;");
        setProduct(data);
        setMainImage(data.images?.[0] || data.image);
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0]?.name || "");
      } catch (error) {
        console.error(`%c❌ DETAIL: FAILED TO LOAD PRODUCT ${id}`, "color: red; font-weight: bold;");
        if (import.meta.env.VITE_USE_MOCK === "true") {
          const fallback = MOCK_PRODUCTS.find(p => p.id === id);
          setProduct(fallback);
          if (fallback) {
            setMainImage(fallback.image);
            setSelectedSize(fallback.sizes[0]);
            setSelectedColor(fallback.colors?.[0]?.name || "");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (isLoading) return (<div className="flex flex-col items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-orange-600 w-12 h-12 mb-4" /><p className="text-slate-500 font-medium">Đang tải chi tiết sản phẩm...</p></div>);
  if (!product) return (<div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2><button onClick={() => navigate("/products")} className="text-orange-600 hover:underline">Quay lại danh sách</button></div>);

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 mb-6 font-medium"><ChevronLeft className="w-5 h-5" /> Quay lại</button>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div className="aspect-square bg-slate-50 rounded-2xl relative overflow-hidden flex-grow"><img src={mainImage || product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" /></div>
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {allImages.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? "border-orange-600 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>
                ))}
              </div>
            )}
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-2 text-sm font-bold text-slate-400 uppercase tracking-widest">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{product.name}</h1>
            <div className="flex items-end gap-4 mb-6"><span className="text-3xl font-bold text-orange-600">{formatPrice(product.price)}</span></div>
            <p className="text-slate-600 mb-8 leading-relaxed">{product.description}</p>
            {/* ... Giữ nguyên phần chọn size, màu, và các hành động addToCart như file cũ ... */}
          </div>
        </div>
      </div>
    </div>
  );
};