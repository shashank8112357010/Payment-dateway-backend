const express = require("express");
const { createPayment, getPaymentDetails, renderCheckoutPage } = require("../controllers/paymentControllers");
const authenticate = require("../middleware/authentication");
const router = express.Router();

// Make Payment: 
router.post("/payment", express.urlencoded({ extended: true }), createPayment);

// Get All Transactions of a User: 
router.get("/getMyTransactions", getPaymentDetails);

router.get("/checkout", renderCheckoutPage);

module.exports = router;