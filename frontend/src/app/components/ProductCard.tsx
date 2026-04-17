import React from "react";
import { Link, useNavigate } from "react-router";
import { Product, formatPrice } from "../data/mockData";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const defaultSize = product.sizes[0] || "One Size";
    const defaultColor = product.colors?.[0]?.name || "Mặc định";
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            MỚI
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium shadow-lg hover:bg-orange-700 transition-colors"
          >
            Thêm nhanh
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">{product.brand}</div>
        <h3 className="font-medium text-slate-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end gap-2">
          <span className="font-bold text-lg text-orange-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through mb-1">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};