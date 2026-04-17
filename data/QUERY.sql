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
-- 15. TOP 5 SẢN PHẨM BÁN CHẠY
-- ==============================
SELECT TOP 5
    p.name,
    SUM(od.quantity) AS total_sold
FROM OrderDetails od
JOIN ProductVariants pv ON od.variant_id = pv.variant_id
JOIN Products p ON pv.product_id = p.product_id
GROUP BY p.name
ORDER BY total_sold DESC;

-- ==============================
-- 16. DOANH THU THEO SẢN PHẨM
-- ==============================
SELECT 
    p.name,
    SUM(od.quantity * od.price) AS revenue
FROM OrderDetails od
JOIN ProductVariants pv ON od.variant_id = pv.variant_id
JOIN Products p ON pv.product_id = p.product_id
GROUP BY p.name;

-- ==============================
-- 17. SẢN PHẨM CHƯA BÁN
-- ==============================
SELECT p.*
FROM Products p
LEFT JOIN ProductVariants pv ON p.product_id = pv.product_id
LEFT JOIN OrderDetails od ON pv.variant_id = od.variant_id
WHERE od.order_id IS NULL;

-- ==============================
-- 18. USER CHI TIỀN NHIỀU NHẤT
-- ==============================
SELECT TOP 1
    u.name,
    SUM(o.total_amount) AS total_spent
FROM Users u
JOIN Orders o ON u.user_id = o.user_id
GROUP BY u.name
ORDER BY total_spent DESC;

-- ==============================
-- 19. SẢN PHẨM RATING CAO NHẤT
-- ==============================
SELECT TOP 1
    p.name,
    AVG(r.rating) AS avg_rating
FROM Reviews r
JOIN Products p ON r.product_id = p.product_id
GROUP BY p.name
ORDER BY avg_rating DESC;

-- ==============================
-- 20. THỐNG KÊ ORDER THEO STATUS
-- ==============================
SELECT 
    status,
    COUNT(*) AS total_orders
FROM Orders
GROUP BY status;