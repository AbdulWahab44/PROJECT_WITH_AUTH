const express = require("express");
const router = express.Router();
const UserController = require("../controllers/internalUserController.js");
const upload = require('../middlewares/multer.js');

    router.post('/internalUser/uploadFile',upload.single('image'), UserController.uploadFileToCloudinary);

    router.get("/internalUser/getAllFiles", UserController.getAllFiles);

    router.delete('/internalUser/delete/:publicId',upload.single('image'), UserController.deleteUserFile);

    router.get('/internalUser/getUploadedFile/:publicId', UserController.getUploadedFile);

module.exports = router;