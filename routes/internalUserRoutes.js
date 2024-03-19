const express = require("express");
const router = express.Router();
const UserController = require("../controllers/internalUserController.js");
const upload = require('../middlewares/multer.js');
// const checkUserAuth = require("../middlewares/auth-middleware.js");




    // Route Level-Middleware - To Protect Route
    // router.use("/internalUser/uploadFile", upload.single('image'), checkUserAuth);
    // router.use("/internalUser/getAllFiles", checkUserAuth);
    // router.use("/internalUser/delete/:publicId", checkUserAuth);
    // router.use("/internalUser/getUploadedFile/:publicId", checkUserAuth);

    // For register 
    // router.post("/internalUser/userRegistration", UserController.userRegistration);
    // For Login
    // router.post("/internalUser/userLogin", UserController.userLogin);

    router.post("/internalUser/uploadFile",upload.single('image'), UserController.uploadFileToCloudinary);

    router.get("/internalUser/getAllFiles", UserController.getAllFiles);

    router.delete("/internalUser/delete/:publicId",upload.single('image'), UserController.deleteUserFile);

    router.get("/internalUser/getUploadedFile/:publicId", UserController.getUploadedFile);

module.exports = router;