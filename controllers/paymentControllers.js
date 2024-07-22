const Payment = require("../models/paymentModel");

// method to create payment: 
module.exports.createPayment = async (req, res) => {
    try {
        const { amount, currency, firstName, lastName, country, phoneNo, email, cardNumber, validThru, cvv, nameOnCard } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Provide amount",
            })
        }

        // if(!currency){
        //     return res.status(400).json({
        //         success: false,
        //         message: "Provide currency",
        //     })
        // }

        if (!firstName) {
            return res.status(400).json({
                success: false,
                message: "Provide First Name",
            })
        }

        if (!lastName) {
            return res.status(400).json({
                success: false,
                message: "Provide Last Name",
            })
        }

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "Provide country",
            })
        }

        if (!phoneNo) {
            return res.status(400).json({
                success: false,
                message: "Provide Phone number",
            })
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Provide Email",
            })
        }

        if (!cardNumber) {
            return res.status(400).json({
                success: false,
                message: "Provide Card Number",
            })
        }

        if (!validThru) {
            return res.status(400).json({
                success: false,
                message: "Provide valid through",
            })
        }

        if (!cvv) {
            return res.status(400).json({
                success: false,
                message: "Provide CVV",
            })
        }

        if (!nameOnCard) {
            return res.status(400).json({
                success: false,
                message: "Provide Name On Card",
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

module.exports.renderCheckoutPage = (req, res) => {
    res.render('payment');
}