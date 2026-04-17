
USE QLbanhangquanao;
GO

-- =========================================
-- 1. CHECK STOCK
-- =========================================
CREATE OR ALTER TRIGGER trg_CheckStock
ON OrderDetails
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN ProductVariants v 
            ON i.variant_id = v.variant_id
        WHERE i.quantity > v.stock
    )
    BEGIN
        RAISERROR (N'Số lượng vượt quá tồn kho!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- =========================================
-- 2. UPDATE STOCK
-- =========================================
CREATE OR ALTER TRIGGER trg_UpdateStock
ON OrderDetails
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH d AS (
        SELECT variant_id, SUM(quantity) AS qty
        FROM deleted
        GROUP BY variant_id
    ),
    i AS (
        SELECT variant_id, SUM(quantity) AS qty
        FROM inserted
        GROUP BY variant_id
    )
    UPDATE v
    SET v.stock = v.stock
        + ISNULL(d.qty, 0)
        - ISNULL(i.qty, 0)
    FROM ProductVariants v
    LEFT JOIN d ON v.variant_id = d.variant_id
    LEFT JOIN i ON v.variant_id = i.variant_id;
END;
GO

-- =========================================
-- 3. UPDATE TOTAL AMOUNT
-- =========================================
CREATE OR ALTER TRIGGER trg_UpdateOrderTotal
ON OrderDetails
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE o
    SET total_amount = COALESCE((
        SELECT SUM(od.quantity * od.price)
        FROM OrderDetails od
        WHERE od.order_id = o.order_id
    ), 0)
    FROM Orders o
    WHERE o.order_id IN (
        SELECT order_id FROM inserted
        UNION
        SELECT order_id FROM deleted
    );
END;
GO

-- =========================================
-- 4. CANCEL ORDER RESTORE STOCK
-- =========================================
CREATE OR ALTER TRIGGER trg_RestoreStock_OnCancel
ON Orders
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(status)
    BEGIN
        UPDATE v
        SET v.stock = v.stock + od.quantity
        FROM ProductVariants v
        JOIN OrderDetails od ON v.variant_id = od.variant_id
        JOIN inserted i ON od.order_id = i.order_id
        JOIN deleted d ON i.order_id = d.order_id
        WHERE i.status = N'Cancelled'
          AND d.status <> N'Cancelled';
    END
END;
GO

-- =========================================
-- 5. PREVENT DELETE PRODUCT
-- =========================================
CREATE OR ALTER TRIGGER trg_PreventDeleteProduct
ON Products
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN ProductVariants v ON d.product_id = v.product_id
        JOIN OrderDetails od ON v.variant_id = od.variant_id
    )
    BEGIN
        RAISERROR (N'Không thể xóa sản phẩm đã được bán!', 16, 1);
        ROLLBACK;
        RETURN;
    END

    DELETE FROM Products
    WHERE product_id IN (SELECT product_id FROM deleted);
END;
GO

-- =========================================
-- 6. CHECK REVIEW
-- =========================================
CREATE OR ALTER TRIGGER trg_CheckReviewPurchase
ON Reviews
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        WHERE NOT EXISTS (
            SELECT 1
            FROM Orders o
            JOIN OrderDetails od ON o.order_id = od.order_id
            JOIN ProductVariants v ON od.variant_id = v.variant_id
            WHERE o.user_id = i.user_id
              AND v.product_id = i.product_id
              AND o.status = N'Completed'
        )
    )
    BEGIN
        RAISERROR (N'Chỉ được review khi đã mua hàng!', 16, 1);
        ROLLBACK;
        RETURN;
    END

    INSERT INTO Reviews(user_id, product_id, rating, comment)
    SELECT user_id, product_id, rating, comment
    FROM inserted;
END;
GO

-- =========================================
-- 7. AUTO CREATE CART
-- =========================================
CREATE OR ALTER TRIGGER trg_CreateCart_ForUser
ON Users
AFTER INSERT
AS
BEGIN
    INSERT INTO Cart(user_id)
    SELECT i.user_id
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1 FROM Cart c WHERE c.user_id = i.user_id
    );
END;
GO

-- =========================================
-- 8. CONSTRAINT
-- =========================================
ALTER TABLE ProductVariants
ADD CONSTRAINT CK_Stock_NonNegative CHECK (stock >= 0);
GO