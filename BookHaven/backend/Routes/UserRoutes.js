const express = require("express");
const router = express.Router();
//Insert Model
const User = require("../Model/UserModel");
//Set usercontroller
const UserController = require("../Controllers/UserController");
const AuthController = require("../Controllers/AuthController");

// If UserController exports an object with methods, use the correct method, e.g., getUsers
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.get("/verify-email", UserController.verifyEmail);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post('/login', UserController.loginUser);
router.post('/admin/login', UserController.loginAdmin);
router.post('/reset-password/:token', AuthController.resetPassword);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/refresh-token', UserController.refreshAccessToken);
router.post('/reset-password/:token', AuthController.resetPassword);

//export
module.exports = router;