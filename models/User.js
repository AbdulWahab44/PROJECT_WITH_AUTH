const mongoose = require("mongoose");

// Defining Schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
})

// Model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;