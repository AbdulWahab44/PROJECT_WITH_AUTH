
const mongoose = require('mongoose');

const userFileSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },
    publicId: String,
    name: {
      type: String
    },
    fileName: String 
});

const UserFile = mongoose.model('externalUserFile', userFileSchema);

module.exports = UserFile;