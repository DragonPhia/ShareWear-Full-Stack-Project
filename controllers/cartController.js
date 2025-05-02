//cartController.js
const cartModel = require("../models/cartModel");

exports.getCartItems = (req, res) => {
  const userId = req.params.userId;
  try {
    const items = cartModel.getCartByUserId(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

exports.addToCart = (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "Missing userId, productId, or quantity" });
  }

  try {
    const cartId = cartModel.getOrCreateCartId(userId);

    // Check if the product is already in the cart
    const existing = cartModel.getCartItem(cartId, productId);

    if (existing) {
      // Update quantity instead of inserting again
      cartModel.updateCartItem(cartId, productId, quantity + existing.quantity);
    } else {
      cartModel.addToCart(cartId, productId, quantity);
    }

    res.json({ success: true, cartId, productId, quantity });
  } catch (err) {
    console.error("Failed to add to cart:", err);
    res.status(500).json({ error: "Item does not exist. Failed to add item to cart" });
  }
};

exports.removeFromCart = (req, res) => {
  const { cartId, cartProductId } = req.params;

  if (!cartId || !cartProductId) {
    return res.status(400).json({ error: "Missing cartId or cartProductId in URL" });
  }

  try {
    const existingCartProduct = cartModel.getCartItemById(cartId, cartProductId);

    if (!existingCartProduct) {
      return res.status(404).json({ message: `Product with cart_product_id ${cartProductId} not found in cart ${cartId}` });
    }

    cartModel.removeFromCart(cartId, cartProductId);
    res.json({ success: true, message: `Product with cart_product_id ${cartProductId} removed from cart ${cartId}` });

  } catch (err) {
    console.error("Failed to remove product from cart:", err);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

exports.checkoutCart = (req, res) => {
  const { cartId } = req.params;

  if (!cartId) {
    return res.status(400).json({ error: "Missing cartId" });
  }

  try {
    cartModel.checkoutCart(cartId);
    res.json({ success: true, message: `Cart ${cartId} successfully checked out` });
  } catch (err) {
    console.error("Failed to checkout cart:", err);
    res.status(500).json({ error: "Failed to checkout cart" });
  }
};