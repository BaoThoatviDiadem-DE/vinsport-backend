import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setIsSearched(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Theo Dõi Đơn Hàng</h1>
        <p className="text-slate-500 text-lg">Nhập mã đơn hàng của bạn để kiểm tra tình trạng giao hàng.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="VD: VS12345"
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-0 text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          </div>
          <button 
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-colors whitespace-nowrap"
          >
            Kiểm tra ngay
          </button>
        </form>
      </div>

      {isSearched && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Đơn hàng #{orderId}</h2>
              <p className="text-slate-500 mt-1">Đặt ngày 15/04/2026</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-semibold text-sm">
              Đang giao hàng
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pb-12">
            <div className="absolute left-[21px] top-0 bottom-0 w-1 bg-slate-100"></div>
            
            <div className="space-y-8 relative">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-white shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-slate-900 text-lg">Đã xác nhận đơn hàng</h3>
                  <p className="text-slate-500">Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
                  <span className="text-sm text-slate-400 mt-1 inline-block">15/04/2026 - 09:30</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-white shadow-lg shadow-green-500/30">
                  <Package className="w-6 h-6" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-slate-900 text-lg">Đã đóng gói</h3>
                  <p className="text-slate-500">Kiện hàng đã được đóng gói và bàn giao cho đơn vị vận chuyển.</p>
                  <span className="text-sm text-slate-400 mt-1 inline-block">16/04/2026 - 14:15</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-white shadow-lg shadow-orange-500/30">
                  <Truck className="w-6 h-6 animate-pulse" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-slate-900 text-lg">Đang giao hàng</h3>
                  <p className="text-slate-500">Shipper đang trên đường giao hàng đến địa chỉ của bạn. Vui lòng chú ý điện thoại.</p>
                  <span className="text-sm text-slate-400 mt-1 inline-block">Hôm nay - 08:45</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 opacity-40">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-slate-900 text-lg">Giao hàng thành công</h3>
                  <p className="text-slate-500">Kiện hàng đã được giao đến tay người nhận.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
