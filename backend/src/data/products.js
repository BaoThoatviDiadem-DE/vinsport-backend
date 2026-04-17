const products = [
  {
    id: "g-n1",
    name: "Giày chạy bộ Nike Pegasus 42",
    category: "Giày",
    brand: "Nike",
    price: 2950000,
    originalPrice: 3829000,
    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/6edeec71-1b18-4990-9742-7068166eb34e/AIR+ZOOM+PEGASUS+42+RR.png",
    images: [
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/50e94abf-c2be-470d-8302-5faf6429375a/AIR+ZOOM+PEGASUS+42+RR.png",
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9497c6ad-681f-4a98-802f-83af5542e0e8/AIR+ZOOM+PEGASUS+42+RR.png"
    ],
    sizes: ["39", "40", "41", "42", "43"],
    colors: [
      {
        name: "Cam/Trắng",
        hex: "#f97316",
        image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cd18da5d-8d0a-4c28-a503-6403b404714c/AIR+ZOOM+PEGASUS+42.png"
      },
      {
        name: "Trắng Xám",
        hex: "#e2e8f0",
        image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/6edeec71-1b18-4990-9742-7068166eb34e/AIR+ZOOM+PEGASUS+42+RR.png"
      }
    ],
    description: "Nike Air Zoom Pegasus 42 mang lại sự thoải mái, đệm êm nhẹ và độ bám tuyệt vời.",
    isNew: true
  },
  {
    id: "g-a1",
    name: "Giày đá banh Adidas Predator Club",
    category: "Giày",
    brand: "Adidas",
    price: 1800000,
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/644a820a87764aa6a4cb0757f5b8a7ef_9366/Giay_Bong_DJa_San_Co_Nhan_Tao_Predator_Club_Mau_xanh_da_troi_JS0355_22_model.jpg",
    images: [
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/966087d117b5459c8e8a53edab2017e7_9366/Giay_Bong_DJa_San_Co_Nhan_Tao_Predator_Club_Mau_xanh_da_troi_JS0355_01_00_standard_hover.jpg",
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/5c47206c86304d95a8a2fef916ef1e15_9366/Giay_Bong_DJa_San_Co_Nhan_Tao_Predator_Club_Mau_xanh_da_troi_JS0355_02_standard.jpg"
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: [
      {
        name: "Xanh dương",
        hex: "#B3EBF2",
        image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/644a820a87764aa6a4cb0757f5b8a7ef_9366/Giay_Bong_DJa_San_Co_Nhan_Tao_Predator_Club_Mau_xanh_da_troi_JS0355_22_model.jpg"
      }
    ],
    description: "Tăng độ bám dính bóng tuyệt vời nhờ công nghệ Control Zone của Adidas.",
    isNew: true
  },
  {
    id: "g-p1",
    name: "Giày bóng đá Futsal Puma Future 8 Match",
    category: "Giày",
    brand: "Puma",
    price: 2100000,
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/108598/01/sv01/fnd/VNM/fmt/png/Gi%C3%A0y-Futsal-FUTURE-8-MATCH-Unisex",
    images: [
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/108598/01/fnd/VNM/fmt/png/Gi%C3%A0y-Futsal-FUTURE-8-MATCH-Unisex"
    ],
    sizes: ["39", "40", "41", "42"],
    colors: [
      {
        name: "Trắng",
        hex: "#ffffff",
        image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/108598/01/sv01/fnd/VNM/fmt/png/Gi%C3%A0y-Futsal-FUTURE-8-MATCH-Unisex"
      }
    ],
    description: "Cấu trúc đàn hồi siêu nhẹ, hỗ trợ bứt tốc trên sân.",
    isNew: true
  },
  {
    id: "a-n1",
    name: "Áo Nike Dri-FIT Academy",
    category: "Áo",
    brand: "Nike",
    price: 890000,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Áo thể thao thoáng khí, thấm hút mồ hôi tốt.",
    isNew: false
  },
  {
    id: "a-a1",
    name: "Áo Đấu Sân Nhà Argentina 26",
    category: "Áo",
    brand: "Adidas",
    price: 2200000,
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/841749a208934f2ab4a0cfa1a8ae237d_9366/Ao_DJau_San_Nha_Argentina_26_trang_JM8396_21_model.jpg",
    images: [
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3c16ce3f59834e0cbe052a59f63e27c5_9366/Ao_DJau_San_Nha_Argentina_26_trang_JM8396_23_hover_model.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Áo sân nhà Argentina với thiết kế nổi bật.",
    isNew: false
  },
  {
    id: "b-1",
    name: "Quả bóng rổ Nike Elite Championship",
    category: "Bóng",
    brand: "Nike",
    price: 1150000,
    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,q_auto:eco/a78b5ce0-3ec5-40b9-aa32-231a31b4ab4b/NIKE+CHAMPIONSHIP+8P.png",
    images: [
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,q_auto:eco/a78b5ce0-3ec5-40b9-aa32-231a31b4ab4b/NIKE+CHAMPIONSHIP+8P.png"
    ],
    sizes: ["7"],
    description: "Bóng rổ tiêu chuẩn thi đấu, bề mặt bám tay tốt.",
    isNew: true
  },
  {
    id: "b-3",
    name: "Quả bóng đá Puma Orbita Serie A",
    category: "Bóng",
    brand: "Puma",
    price: 650000,
    image: "https://images.unsplash.com/photo-1612387605285-7ee92eae6958?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1612387605285-7ee92eae6958?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["5"],
    description: "Bóng đá phù hợp cả sân cỏ tự nhiên và sân cỏ nhân tạo.",
    isNew: false
  },
  {
    id: "pk-1",
    name: "Balo thể thao Adidas Classic",
    category: "Phụ kiện",
    brand: "Adidas",
    price: 550000,
    image: "https://images.unsplash.com/photo-1593460831901-90f761c2d28b?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1593460831901-90f761c2d28b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size"],
    description: "Balo rộng rãi, phù hợp đi học và đi tập.",
    isNew: false
  }
];

module.exports = products;
