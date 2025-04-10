//productController.js

const productModel = require('../models/productModel');

exports.getAllProducts = (req, res) => {
  const products = productModel.getAllProducts();
  const simplifiedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    image_url: product.image_url,
    price: product.price,
  }));
  res.json(simplifiedProducts);
};

exports.searchProducts = (req, res) => {
  const query = req.query.q;
  const products = productModel.searchProducts(query);
  const simplifiedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    image_url: product.image_url,
    price: product.price,
  }));
  res.json(simplifiedProducts);
};

exports.getProductsByCategory = (req, res) => {
  const categoryId = req.params.id;
  const products = productModel.getProductsByCategory(categoryId);
  const simplifiedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    image_url: product.image_url,
    price: product.price,
    category_id: product.category_id,  // Include category_id in the response
  }));
  res.json(simplifiedProducts);
};

// Return all fields for details of a specific product
exports.getProductById = (req, res) => {
  const id = req.params.id;

  try {
    const product = productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: `Product with ID ${id} does not exist` });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details', details: error.message });
  }
};