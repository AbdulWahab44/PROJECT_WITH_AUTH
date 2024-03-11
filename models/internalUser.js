const mongoose = require('mongoose');

const userFileSchema = new mongoose.Schema({
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