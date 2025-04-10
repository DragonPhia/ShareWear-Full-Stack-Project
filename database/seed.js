// seed.js

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

// Connect to the SQLite database file
const db = new Database("database/CSC372-Database-Testing.db", { verbose: console.log });

/**
 * Helper function to run an SQL file from the 'database' folder
 * @param {string} fileName - The name of the SQL file
 */
function runSQLFile(fileName) {
  const filePath = path.join(__dirname, "database", fileName);
  const sql = fs.readFileSync(filePath, "utf8");
  db.exec(sql);
}

/**
 * Seeds the database with initial data
 */
function seedDatabase() {
  console.log("🌱 Seeding database...");

  runSQLFile("drop_tables.sql");
  runSQLFile("create_tables.sql");
  runSQLFile("insert_categories.sql");
  runSQLFile("insert_products.sql");
  runSQLFile("insert_user.sql");
  runSQLFile("insert_cart.sql");

  console.log("✅ Database seeded successfully.");
}

// Export the seed function to be used elsewhere (like in server.js)
module.exports = seedDatabase;