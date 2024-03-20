const express = require("express");
const router = express.Router();
const UserController = require("../controllers/externalUserController.js");
const upload = require('../middlewares/multer.js');
const checkUserAuth = require("../middlewares/externalUserauth.js")

    // Route Level-Middleware - To Protect Route
    router.use("/externalUser/uploadFile", checkUserAuth);
    router.use("/externalUser/getAllFiles", checkUserAuth);
    router.use("/externalUser/delete/:publicId", checkUserAuth);
    router.use("/externalUser/getUploadedFile/:publicId", checkUserAuth);
    
    // Public Routes
    // For register 
    router.post("/externalUser/userRegistration", UserController.userRegistration);
    // For Login
    router.post("/externalUser/userLogin", UserController.userLogin);

    // Protected Routes
    router.post('/external/uploadFile',upload.single('image'), UserController.uploadFileToCloudinary);
    router.get("/external/getAllFiles", UserController.getAllFiles);
    router.get('/external/getUploadedFile/:publicId', UserController.getUploadedFile);
    router.put("/external/approveFile/:publicId", UserController.approveFile);
    router.put("/external/rejectFile/:publicId", UserController.rejectFile);

module.exports = router;