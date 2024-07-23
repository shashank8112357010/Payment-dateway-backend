const express = require("express");
const { register, login, verifyOTP } = require("../controllers/userController");
const router = express.Router();

// USER REGISTRATION: 
router.post("/register", register);

// LOGIN: 
router.post("/login", login);

// VERIFY OTP: 
router.post("/verifyOTP/:userId", verifyOTP);

module.exports = router;