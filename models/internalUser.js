const mongoose = require('mongoose');

const userFileSchema = new mongoose.Schema({
  // name: {type: String, required: true, trim: true},
  // email: {type: String, required: true, trim: true},
  // password: {type: String, required: true, trim: true},
  // Role: {type: String, required: true, trim: true},
  
    imageUrl: {
        type: String,
    },
    publicId: String,
    name: {
      type: String},
    fileName: String // Add field for file name
});

const UserFile = mongoose.model('internalUserFile', userFileSchema);

module.exports = UserFile;