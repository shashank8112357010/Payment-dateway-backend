const express = require("express");
const { register, login, verifyOTP, getUserDetails, editProfile } = require("../controllers/userController");
const authenticate = require("../middleware/authentication");
const { validate } = require("../middleware/validate");
const { registerValidator, loginValidator } = require("../validators/userValidation");
const router = express.Router();

// USER REGISTRATION: 
router.post("/register", validate(registerValidator), register);

// LOGIN: 
router.post("/login", validate(loginValidator), login);

// VERIFY OTP: 
router.post("/verifyOTP/:userId", verifyOTP);

// GET USER DETAILS:
router.get("/getMyDetails", authenticate, getUserDetails);

// UPDATE USER DETAILS: 
router.put("/editProfile", authenticate, editProfile);

module.exports = router;