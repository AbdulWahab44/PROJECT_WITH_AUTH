const mongoose = require('mongoose');

const userFileSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String},
  password: { type: String},
  Role: { type: String},

  imageUrl: String,
  publicId: String,
  fileName: String
});

const UserFile = mongoose.model('internalUserFile', userFileSchema);

module.exports = UserFile;