const express = require("express");
const { createPayment, getPaymentDetails, renderCheckoutPage } = require("../controllers/paymentControllers");
const { register } = require("../controllers/userController");
const router = express.Router();

// User Registration: 
router.post("/register", register);


module.exports = router;