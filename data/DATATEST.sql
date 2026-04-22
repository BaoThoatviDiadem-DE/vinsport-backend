--1. BRANDS
INSERT INTO Brands (name)
VALUES 
(N'Nike'),
(N'Adidas'),
(N'Puma'),
(N'Reebok'),
(N'Under Armour');

--2. CATEGORIES
INSERT INTO Categories (name)
VALUES 
(N'Áo bóng đá'),
(N'Áo gym'),
(N'Quần short'),
(N'Quần dài thể thao'),
(N'Giày chạy bộ'),
(N'Áo khoác thể thao');

--3. COLORS
INSERT INTO Colors (name, hex_code)
VALUES 
(N'Đen', '#000000'),
(N'Trắng', '#FFFFFF'),
(N'Đỏ', '#FF0000'),
(N'Xanh dương', '#0000FF'),
(N'Xanh lá', '#00FF00'),
(N'Xám', '#808080');

--4. SIZES
INSERT INTO Sizes (name)
VALUES 
(N'S'),
(N'M'),
(N'L'),
(N'XL'),
(N'XXL'),
(N'40'),
(N'41'),
(N'42'),
(N'43'),
(N'44'),
(N'45');

--5. USERS
-- role không cần insert vì mặc định database sẽ gán là N'user'
INSERT INTO Users (name, email, password, phone, address)
VALUES 
(N'Nguyễn Văn A', 'a@gmail.com', '123456', '0901111111', N'Hà Nội'),
(N'Trần Thị B', 'b@gmail.com', '123456', '0901111112', N'Hà Nội'),
(N'Lê Văn C', 'c@gmail.com', '123456', '0901111113', N'Hồ Chí Minh'),
(N'Phạm Văn D', 'd@gmail.com', '123456', '0901111114', N'Đà Nẵng'),
(N'Hoàng Văn E', 'e@gmail.com', '123456', '0901111115', N'Hải Phòng'),
(N'Nguyễn Văn F', 'f@gmail.com', '123456', '0901111116', N'Hà Nội'),
(N'Trần Văn G', 'g@gmail.com', '123456', '0901111117', N'Hồ Chí Minh'),
(N'Lê Thị H', 'h@gmail.com', '123456', '0901111118', N'Cần Thơ'),
(N'Phạm Thị I', 'i@gmail.com', '123456', '0901111119', N'Huế'),
(N'Võ Văn K', 'k@gmail.com', '123456', '0901111120', N'Hà Nội'),
(N'Đặng Văn L', 'l@gmail.com', '123456', '0901111121', N'Hải Dương'),
(N'Bùi Văn M', 'm@gmail.com', '123456', '0901111122', N'Nghệ An'),
(N'Đỗ Văn N', 'n@gmail.com', '123456', '0901111123', N'Hà Nội'),
(N'Ngô Văn O', 'o@gmail.com', '123456', '0901111124', N'Hồ Chí Minh'),
(N'Huỳnh Văn P', 'p@gmail.com', '123456', '0901111125', N'Bình Dương'),
(N'anhemtoi','vinsport@gmail.com','123','0968686868',N'PTIT');
--upd admin
UPDATE Users
SET role = N'admin'
WHERE email = 'vinsport@gmail.com';
--6. PRODUCTS
INSERT INTO Products (name, description, brand_id, category_id)
VALUES 
(N'Áo đá banh Nike 2024', N'Áo bóng đá thoáng khí', 1, 1),
(N'Áo gym Adidas Pro', N'Áo tập gym co giãn tốt', 2, 2),
(N'Quần short Puma Run', N'Quần chạy bộ nhẹ', 3, 3),
(N'Giày chạy Adidas Ultraboost', N'Giày chạy cao cấp', 2, 5),
(N'Áo khoác Nike Windrunner', N'Áo khoác chống gió', 1, 6), 
(N'Quần dài Reebok Training', N'Quần tập luyện', 4, 4),
(N'Áo gym Under Armour HeatGear', N'Áo thể thao ôm sát', 5, 2),
(N'Giày chạy Puma Velocity', N'Giày chạy nhẹ', 3, 5),
(N'Áo bóng đá Adidas Real Madrid', N'Áo CLB Real Madrid', 2, 1),
(N'Quần short Nike Flex', N'Quần short linh hoạt', 1, 3),
(N'Áo khoác Puma Sport', N'Áo khoác thể thao', 3, 6),
(N'Giày Reebok Nano', N'Giày training gym', 4, 5);

-- thêm sản phẩm
INSERT INTO Products (name, description, brand_id, category_id)
VALUES
(N'Áo bóng đá Puma Future 2026', N'Áo bóng đá thoáng khí, thiết kế trẻ trung', 3, 1),
(N'Áo gym Nike Dri-FIT Elite', N'Áo gym thấm hút mồ hôi, co giãn tốt', 1, 2),
(N'Quần short Adidas Runner', N'Quần short chạy bộ nhẹ, thoải mái khi vận động', 2, 3),
(N'Giày chạy Nike Air Zoom', N'Giày chạy bộ đệm êm, hỗ trợ bám đường tốt', 1, 5), --sai mau (den)
(N'Áo khoác Under Armour Storm', N'Áo khoác thể thao chống gió, chống nước nhẹ', 5, 6),
(N'Quần dài Puma Training Pro', N'Quần dài thể thao mềm mại, phù hợp tập luyện', 3, 4);

--7. PRODUCT VARIANTS
INSERT INTO ProductVariants (product_id, size_id, color_id, price, stock)
VALUES
(1, 1, 1, 450000, 20),
(1, 2, 2, 450000, 25),
(1, 3, 3, 450000, 15),

(2, 1, 1, 350000, 30),
(2, 2, 4, 350000, 35),
(2, 3, 2, 350000, 40),

(3, 2, 1, 280000, 50),
(3, 3, 2, 280000, 45),
(3, 4, 6, 280000, 20),

(4, 7, 1, 2500000, 10),
(4, 8, 1, 2500000, 8),
(4, 9, 3, 2500000, 5),

(5, 1, 1, 900000, 12),
(5, 2, 1, 900000, 18),

(6, 2, 6, 400000, 25),
(6, 3, 2, 400000, 20),

(7, 1, 2, 320000, 30),
(7, 2, 3, 320000, 28),

(8, 9, 1, 1500000, 15),
(8, 10, 2, 1500000, 10),

(9, 2, 3, 500000, 22),
(9, 3, 1, 500000, 18),

(10, 1, 5, 300000, 40),
(10, 2, 6, 300000, 35),

(11, 3, 1, 600000, 20),
(11, 4, 1, 600000, 15),

(12, 7, 2, 1200000, 12),
(12, 9, 3, 1200000, 10);

-- THÊM SẢN PHẨM
INSERT INTO ProductVariants (product_id, size_id, color_id, price, stock)
VALUES
-- 13. Áo bóng đá Puma Future 2026
(13, 1, 3, 480000, 20),
(13, 2, 2, 480000, 25),
(13, 3, 4, 480000, 18),

-- 14. Áo gym Nike Dri-FIT Elite
(14, 1, 1, 390000, 30),
(14, 2, 3, 390000, 28),
(14, 3, 2, 390000, 22),

-- 15. Quần short Adidas Runner
(15, 2, 1, 310000, 35),
(15, 3, 6, 310000, 30),
(15, 4, 2, 310000, 20),

-- 16. Giày chạy Nike Air Zoom
(16, 6, 1, 2200000, 12),
(16, 8, 1, 2200000, 10),
(16, 10, 4, 2200000, 8),

-- 17. Áo khoác Under Armour Storm
(17, 2, 1, 950000, 15),
(17, 3, 6, 950000, 12),
(17, 4, 2, 950000, 10),

-- 18. Quần dài Puma Training Pro
(18, 2, 1, 420000, 25),
(18, 3, 5, 420000, 20),
(18, 4, 6, 420000, 18);

--8. SALES
INSERT INTO Sales (name, discount_percent, start_date, end_date)
VALUES 
(N'Black Friday', 30, '2026-04-01', '2026-04-30'),
(N'Summer Sale', 20, '2026-05-01', '2026-05-31'),
(N'Flash Sale', 10, '2026-04-10', '2026-04-20');

--9. PRODUCT SALES
INSERT INTO ProductSales (product_id, sale_id)
VALUES 
(1,1),(2,1),(3,1),
(4,2),(5,2),(6,2),
(7,3),(8,3),(9,3);

--10. CART + CART ITEMS
INSERT INTO Cart (user_id)
VALUES (1),(2),(3),(4),(5);

INSERT INTO CartItems (cart_id, variant_id, quantity)
VALUES 
(1,1,2),
(1,3,1),
(2,5,1),
(3,10,2),
(4,15,1),
(5,20,3);

--11. ORDERS
INSERT INTO Orders (user_id, status, total_amount)
VALUES 
(1, N'Pending', 900000),
(2, N'Completed', 700000),
(3, N'Shipping', 2500000),
(4, N'Confirmed', 600000),
(5, N'Cancelled', 300000);

--12. ORDER DETAILS
INSERT INTO OrderDetails (order_id, variant_id, quantity, price)
VALUES 
(1,1,2,450000),
(2,2,2,350000),
(3,4,1,2500000),
(4,6,1,600000),
(5,10,1,300000);

--13. PAYMENTS
INSERT INTO Payments (order_id, method, status)
VALUES 
(1, N'COD', N'Paid'),
(2, N'COD', N'Paid'),
(3, N'Bank', N'Pending'),
(4, N'COD', N'Paid'),
(5, N'Bank', N'Failed');

--14. SHIPPING
INSERT INTO Shipping (order_id, address, status)
VALUES 
(1, N'Hà Nội', N'Preparing'),
(2, N'Hồ Chí Minh', N'Delivered'),
(3, N'Đà Nẵng', N'Shipping'),
(4, N'Hải Phòng', N'Pending'),
(5, N'Huế', N'Cancelled');

--15. REVIEWS
INSERT INTO Reviews (user_id, product_id, rating, comment)
VALUES 
(1,1,5,N'Áo đẹp, chất lượng tốt'),
(2,2,4,N'Ok, mặc thoải mái'),
(3,3,5,N'Rất đáng tiền'),
(4,4,5,N'Giày chạy rất êm'),
(5,5,3,N'Bình thường');

--ANH SAN PHAM
-- 1. Áo đá banh Nike 2024
INSERT INTO ProductImages (product_id, image_url) VALUES
(1, N'https://product.hstatic.net/1000061481/product/dbbd2a87c4ba4e189b9670ba97f854b8_53f4965f4af3437baa5cce2f6393fdcc_master.jpg'),
(1, N'https://product.hstatic.net/1000061481/product/psg_m_nk_df_jsy_ss_stad_aw_408c245882774399aa575322f793d7b9_master.png');

-- 2. Áo gym Adidas Pro
INSERT INTO ProductImages (product_id, image_url) VALUES
(2, N'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/816bb2cfb39d467a8871ac161dc56e80_9366/Designed_for_Training_Pro-Series_Tee_Black_JI8229_HM1.jpg'),
(2, N'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/ed16005d2da74951becc6ea34c3c93d6_9366/Designed_for_Training_Pro-Series_Tee_Black_JI8229_HM3_hover.jpg');

-- 3. Quần short Puma Run
INSERT INTO ProductImages (product_id, image_url) VALUES
(3, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/525791/01/fnd/VNM/fmt/png/Qu%E1%BA%A7n-short-d%E1%BB%87t-thoi-PUMA-RUN-nam'),
(3, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/528432/01/mod01/fnd/VNM/fmt/png/Qu%E1%BA%A7n-short-ch%E1%BA%A1y-b%E1%BB%99-Dreamrun-7-cho-n%E1%BB%AF');

-- 4. Giày chạy Adidas Ultraboost
INSERT INTO ProductImages (product_id, image_url) VALUES
(4, N'https://bizweb.dktcdn.net/thumb/1024x1024/100/347/092/products/adidas-ultraboost-4-0-dna-gw2293-01.jpg'),
(4, N'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/01/giay-chay-bo-nam-adidas-run-ultraboost-light-shoes-gz5159-mau-den-size-40-65a4980d02dc7-15012024092725.jpg');

-- 5. Áo khoác Nike Windrunner
INSERT INTO ProductImages (product_id, image_url) VALUES
(5, N'https://sneakerdaily.vn/wp-content/uploads/2024/07/Ao-Nike-Sportswear-Windrunner-Men-Hooded-Jacket-DA0002-018-1.jpg'),
(5, N'https://bizweb.dktcdn.net/100/425/004/products/442499689-421919930610962-6518004982495923508-n.jpg?v=1716617935117');

-- 6. Quần dài Reebok Training
INSERT INTO ProductImages (product_id, image_url) VALUES
(6, N'https://thesneakerhouse.com/wp-content/uploads/2020/09/REEBOK-TRAINING-ESSENTIALS-TRACK-PANTS-4.jpg'),
(6, N'https://dosi-in.com/file/detailed/381/dosiin-reebok-quan-dai-vo-tu-do-nam-reebok-ufc-fg-fight-week-jogger-dq-381509381509.jpeg?w=1000&h=1000&fit=fill&fm=webp');

-- 7. Áo gym Under Armour HeatGear
INSERT INTO ProductImages (product_id, image_url) VALUES
(7, N'https://supersports.com.vn/cdn/shop/files/1361518-100-1_1200x1200.jpg?v=1738659217'),
(7, N'https://supersports.com.vn/cdn/shop/files/1361521-100-2_1024x1024.jpg?v=1722418328');

-- 8. Giày chạy Puma Velocity
INSERT INTO ProductImages (product_id, image_url) VALUES
(8, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/311141/01/sv01/fnd/VNM/fmt/png/Gi%C3%A0y-Ch%E1%BA%A1y-B%E1%BB%99-Velocity-NITRO%E2%84%A2-4-N%E1%BB%AF'),
(8, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/311140/05/sv01/fnd/VNM/fmt/png/Gi%C3%A0y-Ch%E1%BA%A1y-B%E1%BB%99-Velocity-NITRO%E2%84%A2-4-Nam');

-- 9. Áo bóng đá Adidas Real Madrid
INSERT INTO ProductImages (product_id, image_url) VALUES
(9, N'https://assets.adidas.com/images/w_600,f_auto,q_auto/78b62417f1e042aeb25e3353d278de3b_9366/Ao_DJau_San_Nha_Authentic_Real_Madrid_24-25_trang_IX8095_HM1.jpg'),
(9, N'https://www.sporter.vn/wp-content/uploads/2017/06/Ao-bong-da-real-madrid-trang-2526-0.jpg');

-- 10. Quần short Nike Flex
INSERT INTO ProductImages (product_id, image_url) VALUES
(10, N'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2022/02/qua-n-shorts-nike-pro-flex-vent-max-men-s-shorts-beige-cj1957-320-size-m-620f5ced7e1e8-18022022154637.jpg'),
(10, N'https://bizweb.dktcdn.net/100/428/250/products/4f277d37-6fd2-47df-9b63-689cb7e81b0f-1695094229946.jpg?v=1709809895327');

-- 11. Áo khoác Puma Sport 
INSERT INTO ProductImages (product_id, image_url) VALUES
(11, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/526607/01/mod01/fnd/VNM/fmt/png/%C3%81o-kho%C3%A1c-nam-ch%E1%BA%A1y-b%E1%BB%99-d%E1%BB%87t-VELOCITY'),
(11, N'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/12/ao-khoac-puma-t7-women-s-track-jacket-62146401-mau-den-6583f952aad76-21122023153738.jpg');

-- 12. Giày Reebok Nano
INSERT INTO ProductImages (product_id, image_url) VALUES
(12, N'https://authentic-shoes.com/wp-content/uploads/2023/04/removal.ai__tmp-629a31059e97a_d7574a6c8c184d7d96b0cf2bcaa3ed57.png'),
(12, N'https://i5.walmartimages.com/seo/Reebok-Nano-X1-Women-s-Training-Shoes_13c14100-ebde-42f1-a15b-6adce5517996.aff2edbffde7794474fd1668fd289e93.jpeg');

--THEM SAN PHAM
-- 13. Áo bóng đá Puma Future 2026
INSERT INTO ProductImages (product_id, image_url) VALUES
(13, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/783276/01/fnd/VNM/fmt/png/%C3%81o-Thi-%C4%90%E1%BA%A5u-S%C3%A2n-Nh%C3%A0-B%E1%BB%93-%C4%90%C3%A0o-Nha-2026-Nam-(Authentic)'),
(13, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/788140/77/bv/fnd/VNM/fmt/png/%C3%81o-Thi-%C4%90%E1%BA%A5u-Player-S%C3%A2n-Nh%C3%A0-B%E1%BB%93-%C4%90%C3%A0o-Nha-2026-Nam-(Authentic)');

-- 14. Áo gym Nike Dri-FIT Elite
INSERT INTO ProductImages (product_id, image_url) VALUES
(14, N'https://sneakerdaily.vn/wp-content/uploads/2024/06/Ao-Nike-Pro-Mens-Dri-FIT-Tight-Short-Sleeve-Fitness-Top-FB7933-451.jpg'),
(14, N'https://bizweb.dktcdn.net/100/059/568/products/04847f7705-sp-11226184.jpg?v=1662805203677');

-- 15. Quần short Adidas Runner
INSERT INTO ProductImages (product_id, image_url) VALUES
(15, N'https://supersports.com.vn/cdn/shop/files/IX6371-1_1200x1200.jpg?v=1706846361'),
(15, N'https://bizweb.dktcdn.net/thumb/grande/100/340/361/products/quanshort2trong13socowntherund-621e5c3d-08bb-463c-a8cc-4b9d0839325e.jpg?v=1742786119847');

-- 16. Giày chạy Nike Air Zoom
INSERT INTO ProductImages (product_id, image_url) VALUES
(16, N'https://myshoes.vn/image/catalog/2023/nike/nk10/giay-nike-air-zoom-structure-25-nam-den-trang-01.jpg'),
(16, N'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/08/giay-chay-bo-nam-nike-air-zoom-pegasus-40-dv3853-001-mau-den-trang-size-40-5-66b1d14b2f63c-06082024143123.jpg');

-- 17. Áo khoác Under Armour Storm
INSERT INTO ProductImages (product_id, image_url) VALUES
(17, N'https://cdn.storims.com/api/v2/image/resize?path=https://storage.googleapis.com/storims_cdn/storims/uploads/633cc73f45f27971f6dede057ac6aab7.jpeg&format=jpeg'),
(17, N'https://laz-img-sg.alicdn.com/p/d333dde3d18e294bc89ae9eb8df8f57f.jpg');

-- 18. Quần dài Puma Training Pro
INSERT INTO ProductImages (product_id, image_url) VALUES
(18, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/526592/01/mod01/fnd/VNM/fmt/png/Qu%E1%BA%A7n-d%C3%A0i-ch%E1%BA%A1y-b%E1%BB%99-VELOCITY-c%E1%BA%A1p-su%C3%B4ng-cho-n%E1%BB%AF'),
(18, N'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/528581/01/fnd/VNM/fmt/png/Qu%E1%BA%A7n-b%C3%B3-Dreamrun-7/8-cho-n%E1%BB%AF');