import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Package, MapPin, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../data/mockData";
import api from "../api/api";

export const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // THÊM MỚI: State để lưu mã đơn hàng nhận về từ Server
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod"
  });

  if (items.length === 0 && !isSuccess) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData = {
      customer: {
        name: formData.fullName,
        phone: formData.phone,
        email: user?.email,
        address: `${formData.address}, ${formData.city}`
      },
      items: items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        price: item.product.price
      })),
      totalAmount: totalPrice,
      paymentMethod: formData.paymentMethod,
      orderDate: new Date().toISOString()
    };

    try {
      // Gửi đơn hàng và "hứng" kết quả trả về từ Backend
      const response: any = await api.post("/orders", orderData);
      
      // LẤY MÃ ĐƠN HÀNG THẬT (Tùy bạn Backend đặt tên là id hay orderId)
      setOrderId(response.id || response.orderId || "VS" + Math.floor(Math.random() * 100000));
      
      setIsSuccess(true);
      clearCart();
    } catch (error: any) {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        setOrderId("VS" + Math.floor(Math.random() * 100000)); // Mã giả khi demo không có Backend
        setIsSuccess(true);
        clearCart();
      } else {
        alert("Lỗi kết nối hệ thống, không thể đặt hàng!");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Giao diện khi đặt hàng thành công
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Đặt hàng thành công!</h1>
          
          {/* HIỂN THỊ MÃ ĐƠN HÀNG Ở ĐÂY */}
          <p className="text-slate-600 mb-8 text-lg">
            Cảm ơn bạn đã mua sắm tại VinSport. Mã đơn hàng của bạn là: 
            <span className="font-bold text-orange-600 ml-2">#{orderId}</span>
            <br />Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Truyền mã đơn sang trang tracking nếu cần */}
            <button 
              onClick={() => navigate("/tracking", { state: { orderId } })} 
              className="py-3 px-8 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Theo dõi đơn hàng
            </button>
            <button onClick={() => navigate("/")} className="py-3 px-8 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors">Tiếp tục mua sắm</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Thanh toán</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form bên trái */}
        <div className="flex-grow order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><MapPin className="text-orange-600" /> Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Họ và tên *" />
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Số điện thoại *" />
                <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none md:col-span-2">
                  <option value="">Chọn Tỉnh/Thành phố *</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none md:col-span-2" placeholder="Địa chỉ cụ thể *" />
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CreditCard className="text-orange-600" /> Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-orange-600 bg-orange-50' : 'border-slate-200'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                  <span className="font-bold block">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'banking' ? 'border-orange-600 bg-orange-50' : 'border-slate-200'}`}>
                  <input type="radio" name="paymentMethod" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleInputChange} className="hidden" />
                  <span className="font-bold block">Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors text-lg shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý đơn hàng...
                </>
              ) : (
                "Hoàn tất đặt hàng"
              )}
            </button>
          </form>
        </div>

        {/* Sidebar tóm tắt bên phải */}
        <div className="w-full lg:w-[400px] flex-shrink-0 order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Package className="text-orange-600" /> Tóm tắt đơn hàng</h2>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded border flex-shrink-0 overflow-hidden relative">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{item.product.name}</h4>
                    <p className="text-xs text-slate-500">Size: {item.selectedSize} | Màu: {item.selectedColor}</p>
                    <p className="text-sm font-medium text-orange-600">{formatPrice(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600 text-sm"><span>Tạm tính</span><span className="font-medium">{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3"><span className="font-bold text-slate-900">Tổng cộng</span><span className="font-black text-2xl text-orange-600">{formatPrice(totalPrice)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};