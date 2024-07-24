
const Payment = require("../models/paymentModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

function formatDateAndTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}



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

        // FOR MERCHANT DETAILS:
        // Getting user's (merchant) token:
        const userToken = req.headers.authorization;

        if (!userToken) {
            return res
                .status(401)
                .json({
                    message: "Please authenticate using a token"
                })
        }
        let token = userToken.split(" ");
        const JWT_TOKEN = token[1];
        // console.log("user token ---> ", JWT_TOKEN);

        const decoded = jwt.verify(JWT_TOKEN, process.env.JWT_SECRET);
        const merchantId = decoded.id;

        // Get the current date and time and format it
        const currentDateAndTime = new Date();
        const formattedDateAndTime = formatDateAndTime(currentDateAndTime);
        // console.log("date == ", formattedDateAndTime)

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
            // dateAndTime: Date.now(),
            dateAndTime: formattedDateAndTime,
            status: "Completed",
            merchantId
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

        // const { email } = req.user;


        // GETTING MERCHANT ID FROM TOKEN : 
        const { id } = req.user;
        console.log(" MERCHANT ID == ", id);


        /*
        const pageSize = 2;

        let { pageNum = 1, dateFrom, dateTo } = req.query;

        const DocToSkip = (pageNum - 1) * pageSize;

        const filter = {}

        if (dateFrom && dateTo) {
            filter.dateFrom = dateFrom;
            filter.dateTo = dateTo;
        }

        // const allTransactions = await Payment.find({ cardNumber: cardNumber });

        // const allTransactions = await Payment.find({ merchantId: id });
        const allTransactions = await Payment.find(filter);
        const allCount = allTransactions.length;
        const result = await Payment.find(filter).skip(DocToSkip).limit(pageSize);
*/


        const allTransactions = await Payment.find({ merchantId: id });

        // If no transactions found for a user: 
        if (allTransactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found for user.."
            })
        }
        // if (result.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No transactions found"
        //     })
        // }

        return res.status(200).json({
            success: true,
            message: "Transactions found",
            allTransactions,
            // transactionsCount,
            // result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// GET ALL TRANSACTIONS OF A MERCHANT: 
module.exports.getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("MERCHANT ID == ", id);

        const result = await Payment.find({ merchantId: id });

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Transaction details..",
            result
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