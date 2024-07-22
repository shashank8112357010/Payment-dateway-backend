const Payment = require("../models/paymentModel");

// method to create payment: 
module.exports.createPayment = async (req, res) => {
    try {
        const { amount, currency, firstName, lastName, country, phoneNo, email, address, cardNumber, validThru, cvv, nameOnCard } = req.body;

        if (!amount || !currency || !firstName || !lastName || !country || !phoneNo || !email || !address || cardNumber || !validThru || !cvv || !nameOnCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields!!"
            })
        }

        const payment = await Payment.create({
            amount,
            currency,
            firstName,
            lastName,
            country,
            phoneNo,
            email,
            address,
            cardNumber,
            validThru,
            cvv,
            nameOnCard
        });

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

// Getting all transactions of user: 
module.exports.getPaymentDetails = async (req, res) => {
    try {
        // const {userId} = req.params.id;

        // const { cardNumber } = req.body;
        const { email } = req.body;

        // const allTransactions = await Payment.find({ cardNumber: cardNumber });
        const allTransactions = await Payment.find({ email: email });

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