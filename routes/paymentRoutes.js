const express = require("express");
const { createPayment, getPaymentDetails, renderCheckoutPage } = require("../controllers/paymentControllers");
const router = express.Router();


router.post("/payment", createPayment);

router.get("/getMyTransactions", getPaymentDetails);

router.get("/checkout", renderCheckoutPage);

module.exports = router;