// models/cartModel.js

const db = require("./database");

exports.getCartByUserId = (userId) => {
  // Try to get an existing new cart
  let cart = db.get("SELECT id FROM Carts WHERE user_id = ? AND status = 'new'", userId);

  // If no cart, create one
  if (!cart) {
    const result = db.run("INSERT INTO Carts (status, user_id) VALUES ('new', ?)", userId);
    const newCartId = result.lastInsertRowid;
    cart = { id: newCartId };
  }

  // Get cart items
  const items = db.all(`
    SELECT cp.id AS cart_product_id, cp.quantity, p.name AS product_name, p.price, p.image_url
    FROM CartProducts cp
    JOIN Products p ON cp.product_id = p.id
    WHERE cp.cart_id = ?
  `, cart.id);

  return { cartId: cart.id, items };
};

exports.getOrCreateCartId = (userId) => {
  const cart = db.get("SELECT * FROM Carts WHERE user_id = ? AND status = 'new'", userId);
  if (cart) return cart.id;

  const result = db.run("INSERT INTO Carts (status, user_id) VALUES ('new', ?)", userId);
  return result.lastInsertRowid;
};

exports.addToCart = (cartId, productId, quantity) => {
  return db.run("INSERT INTO CartProducts (cart_id, product_id, quantity) VALUES (?, ?, ?)", cartId, productId, quantity);
};

exports.getCartItem = (cartId, productId) => {
  return db.get(
    "SELECT * FROM CartProducts WHERE cart_id = ? AND product_id = ?",
    cartId,
    productId
  );
};

exports.getCartItemById = (cartId, cartProductId) => {
  return db.get(
    "SELECT * FROM CartProducts WHERE cart_id = ? AND id = ?",
    cartId,
    cartProductId
  );
};

exports.updateCartItem = (cartId, productId, newQuantity) => {
  return db.run(
    "UPDATE CartProducts SET quantity = ? WHERE cart_id = ? AND product_id = ?",
    newQuantity,
    cartId,
    productId
  );
};

exports.removeFromCart = (cartId, cartProductId) => {
  return db.run("DELETE FROM CartProducts WHERE cart_id = ? AND id = ?", cartId, cartProductId);
};

exports.emptyCart = (cartId) => {
  return db.run("DELETE FROM CartProducts WHERE cart_id = ?", cartId);
};

exports.checkoutCart = (cartId) => {
  return db.run("UPDATE Carts SET status = 'purchased' WHERE id = ?", cartId);
};