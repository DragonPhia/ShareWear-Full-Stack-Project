// adminController.js
const adminModel = require('../models/adminModel');

exports.addProduct = (req, res) => {
  const newProduct = req.body;
  try {
    const result = adminModel.addProduct(newProduct);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to add product', details: error.message });
  }
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const result = adminModel.updateProduct(id, updatedData);

    // Check if the result is null, indicating the product doesn't exist
    if (!result) {
      return res.status(404).json({ message: `Product with ID ${id} does not exist` });
    }

    res.json({ message: `Product with ID ${id} successfully updated` });
  } catch (error) {
    res.status(500).json({ error: 'Unable to update product', details: error.message });
  }
};

exports.bulkUploadProducts = (req, res) => {
  const products = req.body;
  try {
    const result = adminModel.bulkUploadProducts(products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to upload products', details: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await adminModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch products', details: error.message });
  }
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  try {
    adminModel.deleteProduct(id);
    res.json({ message: `Product with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete product', details: error.message });
  }
};