const mongoose = require("mongoose");

// Defining Schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    Role: {type: String, required: true, trim: true}
})

// Model
const UserModels = mongoose.model("Adminuser", userSchema);

module.exports = UserModels;