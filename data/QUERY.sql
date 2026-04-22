-- ==============================
-- 1. XEM TẤT CẢ USERS
-- ==============================
SELECT * FROM Users;

-- ==============================
-- 2. XEM TẤT CẢ PRODUCTS
-- ==============================
SELECT * FROM Products;

-- ==============================
-- 3. XEM BRANDS
-- ==============================
SELECT * FROM Brands;

-- ==============================
-- 4. SẢN PHẨM THEO CATEGORY
-- ==============================
SELECT *
FROM Products
WHERE category_id = 1;

-- ==============================
-- 5. ĐẾM USERS
-- ==============================
SELECT COUNT(*) AS total_users
FROM Users;

-- ==============================
-- 6. VARIANT GIÁ > 1 TRIỆU
-- ==============================
SELECT *
FROM ProductVariants
WHERE price > 1000000;

-- ==============================
-- 7. SẢN PHẨM MỚI NHẤT
-- ==============================
SELECT *
FROM Products
ORDER BY created_at DESC;

-- ==============================
-- 8. JOIN PRODUCT - BRAND - CATEGORY
-- ==============================
SELECT 
    p.name AS product_name,
    b.name AS brand,
    c.name AS category
FROM Products p
LEFT JOIN Brands b ON p.brand_id = b.brand_id
LEFT JOIN Categories c ON p.category_id = c.category_id;

-- ==============================
-- 9. VARIANT (SIZE + COLOR)
-- ==============================
SELECT 
    pv.variant_id,
    p.name AS product_name,
    s.name AS size,
    cl.name AS color,
    pv.price,
    pv.stock
FROM ProductVariants pv
JOIN Products p ON pv.product_id = p.product_id
JOIN Sizes s ON pv.size_id = s.size_id
JOIN Colors cl ON pv.color_id = cl.color_id;

-- ==============================
-- 10. SỐ PRODUCT THEO CATEGORY
-- ==============================
SELECT 
    c.name,
    COUNT(p.product_id) AS total_products
FROM Categories c
LEFT JOIN Products p ON c.category_id = p.category_id
GROUP BY c.name;

-- ==============================
-- 11. SEARCH "NIKE"
-- ==============================
SELECT *
FROM Products
WHERE name LIKE N'%Nike%';

-- ==============================
-- 12. SỐ ORDER THEO USER
-- ==============================
SELECT 
    u.name,
    COUNT(o.order_id) AS total_orders
FROM Users u
LEFT JOIN Orders o ON u.user_id = o.user_id
GROUP BY u.name;

-- ==============================
-- 13. DANH SÁCH ORDER
-- ==============================
SELECT 
    o.order_id,
    u.name,
    o.status,
    o.total_amount
FROM Orders o
JOIN Users u ON o.user_id = u.user_id;

-- ==============================
-- 14. DOANH THU HOÀN THÀNH
-- ==============================
SELECT SUM(total_amount) AS revenue
FROM Orders
WHERE status = N'Completed';

-- ==============================
-- 15. XẾP HẠNG KHÁCH HÀNG THEO TỔNG CHI TIÊU
-- (dễ ra dữ liệu hơn câu cũ)
-- ==============================
SELECT 
    u.user_id,
    u.name,
    ISNULL(SUM(o.total_amount), 0) AS total_spent,
    RANK() OVER (ORDER BY ISNULL(SUM(o.total_amount), 0) DESC) AS ranking
FROM Users u
LEFT JOIN Orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name
ORDER BY total_spent DESC;

-- ==============================
-- 16. SẢN PHẨM BÁN CHẠY NHẤT TRONG TỪNG CATEGORY
-- (CTE + RANK)
-- ==============================
WITH ProductSalesByCategory AS (
    SELECT 
        c.category_id,
        c.name AS category_name,
        p.product_id,
        p.name AS product_name,
        SUM(od.quantity) AS total_sold,
        RANK() OVER (
            PARTITION BY c.category_id
            ORDER BY SUM(od.quantity) DESC
        ) AS rnk
    FROM Categories c
    JOIN Products p ON c.category_id = p.category_id
    JOIN ProductVariants pv ON p.product_id = pv.product_id
    JOIN OrderDetails od ON pv.variant_id = od.variant_id
    JOIN Orders o ON od.order_id = o.order_id
    WHERE o.status = N'Completed'
    GROUP BY c.category_id, c.name, p.product_id, p.name
)
SELECT 
    category_name,
    product_name,
    total_sold
FROM ProductSalesByCategory
WHERE rnk = 1;

-- ==============================
-- 17. THỐNG KÊ SỐ LƯỢNG ĐÃ BÁN CỦA TỪNG SẢN PHẨM
-- (không còn bị rỗng như câu sản phẩm chưa bán)
-- ==============================
SELECT 
    p.product_id,
    p.name,
    ISNULL(SUM(od.quantity), 0) AS total_sold
FROM Products p
LEFT JOIN ProductVariants pv ON p.product_id = pv.product_id
LEFT JOIN OrderDetails od ON pv.variant_id = od.variant_id
GROUP BY p.product_id, p.name
ORDER BY total_sold DESC, p.name;

-- ==============================
-- 18. DOANH THU THEO THÁNG VÀ SO SÁNH THÁNG TRƯỚC
-- (CTE + LAG)
-- ==============================
WITH MonthlyRevenue AS (
    SELECT 
        YEAR(order_date) AS [year],
        MONTH(order_date) AS [month],
        SUM(total_amount) AS revenue
    FROM Orders
    WHERE status = N'Completed'
    GROUP BY YEAR(order_date), MONTH(order_date)
)
SELECT 
    [year],
    [month],
    revenue,
    LAG(revenue) OVER (ORDER BY [year], [month]) AS prev_month_revenue,
    revenue - ISNULL(LAG(revenue) OVER (ORDER BY [year], [month]), 0) AS revenue_diff
FROM MonthlyRevenue
ORDER BY [year], [month];

-- ==============================
-- 19. XẾP HẠNG SẢN PHẨM THEO SỐ LƯỢNG BIẾN THỂ
-- (không dùng đánh giá sản phẩm nữa)
-- ==============================
SELECT 
    p.product_id,
    p.name,
    COUNT(pv.variant_id) AS total_variants,
    RANK() OVER (ORDER BY COUNT(pv.variant_id) DESC) AS ranking
FROM Products p
LEFT JOIN ProductVariants pv ON p.product_id = pv.product_id
GROUP BY p.product_id, p.name
ORDER BY ranking, p.name;

-- ==============================
-- 20. GIÁ GỐC - GIÁ SAU KHUYẾN MÃI - TRẠNG THÁI SALE HIỆN TẠI
-- (CASE WHEN + JOIN nhiều bảng)
-- ==============================
SELECT 
    p.product_id,
    p.name AS product_name,
    pv.variant_id,
    pv.price AS original_price,
    s.name AS sale_name,
    s.discount_percent,
    CASE 
        WHEN GETDATE() BETWEEN s.start_date AND s.end_date
            THEN pv.price * (1 - s.discount_percent / 100.0)
        ELSE pv.price
    END AS final_price,
    CASE
        WHEN GETDATE() BETWEEN s.start_date AND s.end_date
            THEN N'Đang áp dụng'
        ELSE N'Không áp dụng'
    END AS sale_status
FROM Products p
JOIN ProductVariants pv ON p.product_id = pv.product_id
LEFT JOIN ProductSales ps ON p.product_id = ps.product_id
LEFT JOIN Sales s ON ps.sale_id = s.sale_id
ORDER BY p.product_id, pv.variant_id;