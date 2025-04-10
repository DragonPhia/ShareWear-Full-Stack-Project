const sqlite = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the 'database' folder exists
const dbFolderPath = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true });
}

// Set the correct database path
const dbPath = path.join(dbFolderPath, 'CSC372-Database-Testing.db');
console.log("Using database path: ", dbPath);

// Connect to the SQLite database file
const db = new sqlite(dbPath);

// Helper function to run SELECT and return all rows
function all(sql, ...params) {
  return db.prepare(sql).all(...params);
}

// Helper to run SELECT and return single row
function get(sql, ...params) {
  return db.prepare(sql).get(...params);
}

// Helper to run INSERT/UPDATE/DELETE
function run(sql, ...params) {
  return db.prepare(sql).run(...params);
}

// Helper to run raw SQL script (multiple statements)
function exec(sql) {
  return db.exec(sql);
}

// Close DB connection
function db_close() {
  console.log("...Closing database connection.");
  db.close();
}

module.exports = {
  all,
  get,
  run,
  exec,
  db_close
};