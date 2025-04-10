// const db = require("./database");

// exports.getUserById = (id) => {
//   return db.get("SELECT * FROM Users WHERE id = ?", id);
// };

// exports.getUserByEmail = (email) => {
//   return db.get("SELECT * FROM Users WHERE email = ?", email);
// };

// exports.createUser = (name, email, password, userType = 'shopper') => {
//   return db.run(
//     "INSERT INTO Users (name, email, password, user_type) VALUES (?, ?, ?, ?)",
//     name, email, password, userType
//   );
// };

// exports.updateUser = (id, name, email) => {
//   return db.run(
//     "UPDATE Users SET name = ?, email = ? WHERE id = ?",
//     name, email, id
//   );
// };