
const Payment = require("../models/paymentModel");
const bcryptjs = require("bcryptjs");

// METHOD TO CREATE PAYMENT: 
module.exports.createPayment = async (req, res) => {
    try {
        // Getting Details: 
        // console.log("req body: ", req.body);
        const { amount, currency, firstName, lastName, country, phoneNo, email, address, cardNumber, validThru, cvv, nameOnCard } = req.body;

        // If Details are missing: 
        if (!amount || !firstName || !lastName || !country || !phoneNo || !email || !address || !cardNumber || !validThru || !cvv || !nameOnCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields!!"
            })
        }

        const enc_cardNumber = await bcryptjs.hash(cardNumber, 10)
        const enc_validThru = await bcryptjs.hash(validThru, 10);
        const enc_cvv = await bcryptjs.hash(cvv, 10);
        const enc_nameOnCard = await bcryptjs.hash(nameOnCard, 10);

        // Saving Details: 
        const payment = await Payment.create({
            amount,
            currency,
            firstName,
            lastName,
            country,
            phoneNo,
            email,
            address,
            cardNumber: enc_cardNumber,
            validThru: enc_validThru,
            cvv: enc_cvv,
            nameOnCard: enc_nameOnCard,
            dateAndTime: Date.now(),
            status: "Completed"
        });
        // console.log("Payment: ", payment)

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// GETTING ALL TRANSACTIONS OF A USER: 
module.exports.getPaymentDetails = async (req, res) => {
    try {
        // const {userId} = req.params.id;

        // Finding all transactions with email (or card number): 
        // const { cardNumber } = req.body;
        // const { email } = req.body;

        // console.log("REQUEST BODY: ", req.body); 
        // console.log("REQUEST USER: ", req.user); 

        const { email } = req.user;
        // console.log("EMAIL == ", email);

        // const allTransactions = await Payment.find({ cardNumber: cardNumber });
        const allTransactions = await Payment.find({ email: email });

        // If no transactions found for a user: 
        if (allTransactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found for user.."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Transactions found",
            allTransactions,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Rendering checkout page: 
module.exports.renderCheckoutPage = (req, res) => {
    res.render('payment');
}