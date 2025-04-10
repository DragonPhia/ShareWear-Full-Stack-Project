// adminModel.js
const db = require("./database");  // Make sure you're importing the database correctly

// Add a single product
exports.addProduct = (product) => {
    const { name, description, image_url, price, category_id, is_featured } = product;
  
    // Ensure all values are correctly assigned
    console.log("Inserting product into DB with values: ", name, description, image_url, price, category_id, is_featured);
  
    // Directly insert into the database
    return db.run(
      "INSERT INTO Products (name, description, image_url, price, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, image_url, price, category_id, is_featured]
    );
  };
  
// Update a product by ID
exports.updateProduct = (id, updatedData) => {
  const existingProduct = db.get("SELECT * FROM Products WHERE id = ?", id);

  if (!existingProduct) {
    // If product does not exist, return null
    return null;
  }

  const { name, description, image_url, price, category_id, is_featured } = updatedData;

  return db.run(
    "UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, is_featured = ? WHERE id = ?",
    [name, description, image_url, price, category_id, is_featured, id]
  );
};

// Bulk upload products
exports.bulkUploadProducts = (products) => {
  products.forEach(product => {
    const { name, description, image_url, price, category_id, is_featured } = product;
    console.log("Inserting product:", name, description, image_url, price, category_id, is_featured);
    
    db.run(
      "INSERT INTO Products (name, description, image_url, price, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, image_url, price, category_id, is_featured]
    );
  });

  return { message: 'Bulk upload completed successfully' };
};