"use strict";

const express = require("express");
const app = express();
const path = require("path");

// Setup middleware for file uploads and data parsing
const multer = require("multer");
app.use(multer().none());  // Handle form data without files
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(express.json());  // Parse JSON data
app.use(express.static("public"));  // Serve static files from the "public" directory

// Connect to the SQLite database
const Database = require("better-sqlite3");
const db = new Database(path.join(__dirname, "database", "CSC372-Database-Testing.db"), {
  verbose: console.log,
});

// Import SQL seed script runner
const fs = require("fs");

// Helper function to run SQL files
function runSQLFile(filename) {
  const filePath = path.join(__dirname, "database", filename);
  const sql = fs.readFileSync(filePath, "utf-8");
  db.exec(sql);
}

// Seed the database on startup
function seedDatabase() {
  try {
    // Drop existing tables
    runSQLFile("drop_tables.sql");

    // Create tables
    runSQLFile("create_tables.sql");

    // Insert seed data
    runSQLFile("insert_categories.sql");
    runSQLFile("insert_products.sql");
    runSQLFile("insert_user.sql");
    runSQLFile("insert_cart.sql");

    console.log("✅ Database seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
  }
}

// Run seeding
seedDatabase();

// Import route files
const productsRoutes = require("./routes/products");
const cartsRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin");

// Use the routes
app.use("/products", productsRoutes);  // All product-related routes
app.use("/carts", cartsRoutes);        // All cart-related routes
app.use("/admin", adminRoutes);        // Admin routes for product management

// Default route
app.get("/", (req, res) => {
  res.redirect("/products");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});