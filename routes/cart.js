const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// http://localhost:3000/carts/1
router.get("/:userId", cartController.getCartItems);

// Add or update product in cart
// http://localhost:3000/carts/1/products/3 **Involves body**
/**
{
  "quantity": 3
}
 */
router.post("/:userId/products/:productId", cartController.addToCart);

// Remove a product from a specific cart
// http://localhost:3000/carts/1/products/2
router.delete("/:cartId/products/:cartProductId", cartController.removeFromCart);

// Checkout a specific cart
// http://localhost:3000/carts/1/checkout
router.post("/:cartId/checkout", cartController.checkoutCart);

module.exports = router;