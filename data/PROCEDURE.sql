
USE QLbanhangquanao;
GO

-- =========================================
-- 1. CREATE ORDER FROM CART
-- =========================================
IF OBJECT_ID('sp_CreateOrderFromCart', 'P') IS NOT NULL
    DROP PROCEDURE sp_CreateOrderFromCart;
GO

CREATE PROCEDURE sp_CreateOrderFromCart
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @order_id INT;
        DECLARE @cart_id INT;

        SELECT @cart_id = cart_id
        FROM Cart
        WHERE user_id = @user_id;

        IF @cart_id IS NULL
        BEGIN
            RAISERROR(N'User chưa có giỏ hàng!',16,1);
            ROLLBACK;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM CartItems WHERE cart_id = @cart_id)
        BEGIN
            RAISERROR(N'Giỏ hàng trống!',16,1);
            ROLLBACK;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM CartItems ci
            JOIN ProductVariants v ON ci.variant_id = v.variant_id
            WHERE ci.cart_id = @cart_id
              AND ci.quantity > v.stock
        )
        BEGIN
            RAISERROR(N'Không đủ hàng!',16,1);
            ROLLBACK;
            RETURN;
        END

        INSERT INTO Orders(user_id)
        VALUES (@user_id);

        SET @order_id = SCOPE_IDENTITY();

        INSERT INTO OrderDetails(order_id, variant_id, quantity, price)
        SELECT @order_id, ci.variant_id, ci.quantity, v.price
        FROM CartItems ci
        JOIN ProductVariants v ON ci.variant_id = v.variant_id
        WHERE ci.cart_id = @cart_id;

        UPDATE ProductVariants
        SET stock = stock - ci.quantity
        FROM ProductVariants v
        JOIN CartItems ci ON v.variant_id = ci.variant_id
        WHERE ci.cart_id = @cart_id;

        UPDATE Orders
        SET total_amount = (
            SELECT SUM(quantity * price)
            FROM OrderDetails
            WHERE order_id = @order_id
        )
        WHERE order_id = @order_id;

        DELETE FROM CartItems
        WHERE cart_id = @cart_id;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;
GO

-- =========================================
-- 2. GET ALL PRODUCTS
-- =========================================
IF OBJECT_ID('sp_GetAllProducts', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetAllProducts;
GO

CREATE PROCEDURE sp_GetAllProducts
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.product_id,
        p.name,
        b.name AS brand,
        c.name AS category,
        MIN(v.price) AS original_price,
        MAX(s.discount_percent) AS discount_percent,
        CASE 
            WHEN MAX(s.discount_percent) IS NOT NULL
            THEN MIN(v.price) * (1 - MAX(s.discount_percent)/100.0)
            ELSE NULL
        END AS sale_price
    FROM Products p
    LEFT JOIN Brands b ON p.brand_id = b.brand_id
    LEFT JOIN Categories c ON p.category_id = c.category_id
    LEFT JOIN ProductVariants v ON p.product_id = v.product_id
    OUTER APPLY (
        SELECT TOP 1 s.discount_percent
        FROM ProductSales ps
        JOIN Sales s ON ps.sale_id = s.sale_id
        WHERE ps.product_id = p.product_id
          AND GETDATE() BETWEEN s.start_date AND s.end_date
        ORDER BY s.discount_percent DESC
    ) s
    GROUP BY p.product_id, p.name, b.name, c.name;
END;
GO

-- =========================================
-- 3. SEARCH PRODUCTS
-- =========================================
IF OBJECT_ID('sp_SearchProducts', 'P') IS NOT NULL
    DROP PROCEDURE sp_SearchProducts;
GO

CREATE PROCEDURE sp_SearchProducts
    @keyword NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.product_id,
        p.name,
        b.name AS brand,
        c.name AS category,
        MIN(v.price) AS original_price,
        MAX(s.discount_percent) AS discount_percent,
        CASE 
            WHEN MAX(s.discount_percent) IS NOT NULL
            THEN MIN(v.price) * (1 - MAX(s.discount_percent)/100.0)
            ELSE NULL
        END AS sale_price
    FROM Products p
    LEFT JOIN Brands b ON p.brand_id = b.brand_id
    LEFT JOIN Categories c ON p.category_id = c.category_id
    LEFT JOIN ProductVariants v ON p.product_id = v.product_id
    OUTER APPLY (
        SELECT TOP 1 s.discount_percent
        FROM ProductSales ps
        JOIN Sales s ON ps.sale_id = s.sale_id
        WHERE ps.product_id = p.product_id
          AND GETDATE() BETWEEN s.start_date AND s.end_date
        ORDER BY s.discount_percent DESC
    ) s
    WHERE (@keyword IS NULL OR @keyword = '')
       OR p.name LIKE '%' + @keyword + '%'
    GROUP BY p.product_id, p.name, b.name, c.name;
END;
GO


-- =========================================
-- 4. GET ORDERS BY USER
-- =========================================
IF OBJECT_ID('sp_GetOrdersByUser', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetOrdersByUser;
GO

CREATE OR ALTER PROCEDURE sp_GetOrdersByUser
    @user_id INT
AS
BEGIN
    SELECT 
        order_id,
        user_id,
        order_date,
        status,
        total_amount
    FROM Orders
    WHERE user_id = @user_id
    ORDER BY order_date DESC;
END;
GO

-- =========================================
-- sp_GetOrderDetails
-- =========================================
IF OBJECT_ID('sp_GetOrderDetails','P') IS NOT NULL
    DROP PROCEDURE sp_GetOrderDetails;
GO

CREATE PROCEDURE sp_GetOrderDetails
    @order_id INT
AS
BEGIN
    SELECT 
        od.order_id,
        p.name,
        s.name AS size,
        c.name AS color,
        od.quantity,
        od.price
    FROM OrderDetails od
    JOIN ProductVariants v ON od.variant_id = v.variant_id
    JOIN Products p ON v.product_id = p.product_id
    JOIN Sizes s ON v.size_id = s.size_id
    JOIN Colors c ON v.color_id = c.color_id
    WHERE od.order_id = @order_id;
END;
GO

-- =========================================
-- sp_AddReview
-- =========================================
IF OBJECT_ID('sp_AddReview','P') IS NOT NULL
    DROP PROCEDURE sp_AddReview;
GO

CREATE PROCEDURE sp_AddReview
    @user_id INT,
    @product_id INT,
    @rating INT,
    @comment NVARCHAR(500)
AS
BEGIN
    IF @rating < 1 OR @rating > 5
    BEGIN
        RAISERROR(N'Rating phải từ 1 đến 5!',16,1);
        RETURN;
    END

    INSERT INTO Reviews(user_id, product_id, rating, comment)
    VALUES (@user_id, @product_id, @rating, @comment);
END;
GO

-- =========================================
-- sp_TopSellingProducts
-- =========================================
IF OBJECT_ID('sp_TopSellingProducts','P') IS NOT NULL
    DROP PROCEDURE sp_TopSellingProducts;
GO

CREATE PROCEDURE sp_TopSellingProducts
AS
BEGIN
    SELECT TOP 5 
        p.name,
        SUM(od.quantity) AS total_sold
    FROM OrderDetails od
    JOIN Orders o ON od.order_id = o.order_id
    JOIN ProductVariants v ON od.variant_id = v.variant_id
    JOIN Products p ON v.product_id = p.product_id
    WHERE o.status = N'Completed'
    GROUP BY p.name
    ORDER BY total_sold DESC;
END;
GO
-- =========================================
-- 8. REVENUE BY DATE
-- =========================================
IF OBJECT_ID('sp_RevenueByDate', 'P') IS NOT NULL
    DROP PROCEDURE sp_RevenueByDate;
GO

CREATE OR ALTER PROCEDURE sp_RevenueByDate
AS
BEGIN
    SELECT 
        CAST(order_date AS DATE) AS order_date,
        SUM(total_amount) AS revenue
    FROM Orders
    WHERE status = N'Completed'
    GROUP BY CAST(order_date AS DATE)
    ORDER BY order_date;
END;
GO

-- =========================================
-- sp_AddToCart
-- =========================================
IF OBJECT_ID('sp_AddToCart','P') IS NOT NULL
    DROP PROCEDURE sp_AddToCart;
GO

CREATE PROCEDURE sp_AddToCart
    @user_id INT,
    @variant_id INT,
    @quantity INT
AS
BEGIN
    DECLARE @cart_id INT;
    DECLARE @stock INT;
    DECLARE @current INT = 0;

    IF @quantity <= 0
    BEGIN
        RAISERROR(N'Số lượng không hợp lệ!',16,1);
        RETURN;
    END

    SELECT @cart_id = cart_id FROM Cart WHERE user_id = @user_id;

    IF @cart_id IS NULL
    BEGIN
        RAISERROR(N'Không tìm thấy giỏ hàng!',16,1);
        RETURN;
    END

    SELECT @stock = stock FROM ProductVariants WHERE variant_id = @variant_id;

    SELECT @current = ISNULL(quantity,0)
    FROM CartItems
    WHERE cart_id = @cart_id AND variant_id = @variant_id;

    IF (@current + @quantity > @stock)
    BEGIN
        RAISERROR(N'Không đủ hàng!',16,1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM CartItems 
        WHERE cart_id = @cart_id AND variant_id = @variant_id
    )
    BEGIN
        UPDATE CartItems
        SET quantity = quantity + @quantity
        WHERE cart_id = @cart_id AND variant_id = @variant_id;
    END
    ELSE
    BEGIN
        INSERT INTO CartItems(cart_id, variant_id, quantity)
        VALUES (@cart_id, @variant_id, @quantity);
    END
END;
GO