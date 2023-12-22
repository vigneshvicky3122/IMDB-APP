const { Schema, model, c } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  createdAt: Date,
});
const User = model("user", userSchema);
module.exports = User;
