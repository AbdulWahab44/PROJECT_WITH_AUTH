const express = require("express");
const router = express.Router();
const UserController = require("../controllers/externalUserController.js");
const upload = require('../middlewares/multer.js');

    router.post('/external/uploadFile',upload.single('image'), UserController.uploadFileToCloudinary);

    router.get("/external/getAllFiles", UserController.getAllFiles);

    router.get('/external/getUploadedFile/:publicId', UserController.getUploadedFile);

    router.put("/external/approveFile/:publicId", UserController.approveFile);

    router.put("/external/rejectFile/:publicId", UserController.rejectFile);

module.exports = router;