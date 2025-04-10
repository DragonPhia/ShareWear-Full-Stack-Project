-- Create a new cart for user with ID 1
INSERT INTO Carts (status, user_id) VALUES ('new', 1);

-- Add items to the cart (assuming cart ID 1 and product IDs 1 and 2 exist)
INSERT INTO CartProducts (cart_id, product_id, quantity) VALUES
(1, 1, 2),  -- 2x Casual T-Shirt
(1, 2, 1);  -- 1x Slim Fit Jeans