import React from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../data/mockData";

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full text-slate-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tham khảo thêm các sản phẩm tại cửa hàng nhé.
        </p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold py-4 px-8 rounded-full hover:bg-orange-700 transition-colors"
        >
          Tiếp tục mua sắm <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Giỏ Hàng</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-grow">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <div className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link to={`/product/${item.product.id}`} className="font-bold text-slate-900 hover:text-orange-600 line-clamp-2 mb-1">
                          {item.product.name}
                        </Link>
                        <span className="text-sm text-slate-500 mb-2">
                          Size: {item.selectedSize} {item.selectedColor && item.selectedColor !== "Mặc định" ? `| Màu: ${item.selectedColor}` : ""} | {item.product.brand}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 w-fit"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </div>
                    </div>

                    {/* Price (Mobile & Desktop) */}
                    <div className="col-span-1 md:col-span-2 text-left md:text-center font-medium">
                      <span className="md:hidden text-slate-500 mr-2">Đơn giá:</span>
                      {formatPrice(item.product.price)}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center font-bold text-sm border-x border-slate-200">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-1 md:col-span-2 text-left md:text-right font-bold text-orange-600">
                      <span className="md:hidden text-slate-500 font-normal mr-2">Thành tiền:</span>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Tổng đơn hàng</h2>
            
            <div className="space-y-4 text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Tổng cộng</span>
                <span className="text-2xl font-black text-orange-600">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-slate-500 text-right mt-1">(Đã bao gồm VAT nếu có)</p>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
            >
              Tiến hành thanh toán <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};