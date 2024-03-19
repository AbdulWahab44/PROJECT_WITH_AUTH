const express = require("express");
const router = express.Router();
const UserController = require("../controllers/adminUserController.js");
const checkUserAuth = require("../middlewares/auth-middleware.js");

    // Route Level-Middleware - To Protect Route
    router.use("/adminUser/create",checkUserAuth)
    router.use("/adminUser/getAll", checkUserAuth);
    router.use("/adminUser/get/:userId", checkUserAuth);
    router.use("/adminUser/modify/:userId", checkUserAuth);
    router.use("/adminUser/delete/:userId", checkUserAuth);

    // For register AdminUser
    router.post("/adminUser/userRegistration", UserController.userRegistration);

    // For Login AdminUser
    router.post("/adminUser/userLogin", UserController.userLogin);

    // For create User
    router.post("/adminUser/create", UserController.User_Create);

    // For get All User Details
    router.get("/adminUser/getAll", UserController.getAll_User_Details);

    // For get SingleUser
    router.get("/adminUser/get/:userId", UserController.Single_User_Detaile);

    // For modify User;
    router.put("/adminUser/modify/:userId", UserController.User_Update);

    // For delete User
    router.delete("/adminUser/delete/:userId", UserController.User_Delete);


module.exports = router; 