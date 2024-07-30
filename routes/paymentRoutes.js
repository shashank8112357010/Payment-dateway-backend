const express = require("express");
const { createPayment, getPaymentDetails, renderCheckoutPage } = require("../controllers/paymentControllers");
const authenticate = require("../middleware/authentication");
const { validate } = require("../middleware/validate");
const { paymentValidator } = require("../validators/paymentValidation");
const router = express.Router();

// Make Payment: 
router.post("/payment", express.urlencoded({ extended: true }), validate(paymentValidator), createPayment);

// Get All Transactions of a User: 
router.get("/getMyTransactions", authenticate, getPaymentDetails);

router.get("/checkout", renderCheckoutPage);

module.exports = router;