// models/categoryModel.js
const db = require("./database");

exports.getAllCategories = () => {
  return db.all("SELECT * FROM Categories");
};