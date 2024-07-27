const express = require("express");
const { register, login, verifyOTP, getUserDetails, editProfile } = require("../controllers/userController");
const authenticate = require("../middleware/authentication");
const router = express.Router();

// USER REGISTRATION: 
router.post("/register", register);

// LOGIN: 
router.post("/login", login);

// VERIFY OTP: 
router.post("/verifyOTP/:userId", verifyOTP);

// GET USER DETAILS:
router.get("/getMyDetails", authenticate, getUserDetails);

// UPDATE USER DETAILS: 
router.put("/editProfile", authenticate, editProfile);

module.exports = router;