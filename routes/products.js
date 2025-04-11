const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// http://localhost:3000/products
router.get('/', productController.getAllProducts);

// http://localhost:3000/products/search?q=<item name>
// ex. http://localhost:3000/products/search?q=T-shirt
router.get('/search', productController.searchProducts);

// http://localhost:3000/products/category/1
router.get('/category/:id', productController.getProductsByCategory);

// http://localhost:3000/products/1
router.get('/:id', productController.getProductById); // view one product with details

module.exports = router;