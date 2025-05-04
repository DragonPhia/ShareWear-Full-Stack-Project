//productModel.js

const db = require("./database");

exports.getAllProducts = () => {
  return db.all("SELECT id, name, image_url, price FROM Products");
};

exports.getProductById = (id) => {
  return db.get(
    `SELECT Products.*, Categories.name AS category_name
     FROM Products
     LEFT JOIN Categories ON Products.category_id = Categories.id
     WHERE Products.id = ?`,
    id
  );
};

exports.searchProducts = (query) => {
  return db.all("SELECT id, name, image_url, price FROM Products WHERE name LIKE ?", `%${query}%`);
};

exports.getProductsByCategory = (categoryId) => {
  return db.all("SELECT * FROM Products WHERE category_id = ?", [categoryId]);
};

exports.addProduct = (name, description, imageUrl, price, categoryId, isFeatured) => {
  return db.run(
    "INSERT INTO Products (name, description, image_url, price, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)",
    name, description, imageUrl, price, categoryId, isFeatured
  );
};

exports.updateProduct = (id, name, description, imageUrl, price, categoryId, isFeatured) => {
  return db.run(
    "UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, is_featured = ? WHERE id = ?",
    name, description, imageUrl, price, categoryId, isFeatured, id
  );
};

exports.getProducts = async (req, res) => {
  try {
    const categoryId = req.query.category_id;
    const products = await productModel.getProducts(categoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};