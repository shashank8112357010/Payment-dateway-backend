
const Payment = require("../models/paymentModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// FUNCTION TO FORMAT DATE: 
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
        const { amount, currency, firstName, lastName, country, phoneNo, email, address, cardNumber, cardExpiry, cvv, nameOnCard } = req.body;

        // const callbackURL = 'www.youtube.com';
        const callbackURL = '';

        // If Details are missing: 
        if (!amount || !firstName || !lastName || !country || !phoneNo || !email || !address || !cardNumber || !cardExpiry || !cvv || !nameOnCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields!!"
            })
        }

        // HASHING CARD DETAILS:
        const enc_cardNumber = await bcryptjs.hash(cardNumber, 10)
        const enc_cardExpiry = await bcryptjs.hash(cardExpiry, 10);
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
            cardExpiry: enc_cardExpiry,
            cvv: enc_cvv,
            nameOnCard: enc_nameOnCard,
            // dateAndTime: Date.now(),
            dateAndTime: formattedDateAndTime,
            status: "Completed",
            merchantId
        });
        // console.log("Payment: ", payment)

        // if (payment) {
        //     if (callbackURL) return res.redirect(200, callbackURL);
        //     return res.status(201).json({
        //         success: true,
        //         message: "Payment created successfully",
        //         payment
        //     })
        // }
        if (callbackURL.length > 0) {
            return res.status(201).json({
                success: true,
                message: "Payment done successfully",
                payment,
                callbackURL: callbackURL,
            })
        }
        else {
            return res.status(201).json({
                success: true,
                message: "Payment done successfully",
                payment,
                // callbackURL: callbackURL,
            })
        }
    } catch (error) {
        // console.log("error line 87")
        // ERROR WHEN MERCHANT'S TOKEN IS EXPIRED:
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired..'
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// GETTING ALL TRANSACTIONS OF A USER: 
module.exports.getPaymentDetails = async (req, res) => {
    try {
        // GETTING MERCHANT ID FROM TOKEN : 
        const { id } = req.user;
        // console.log(" MERCHANT ID == ", id);

        // Getting the values for filters from query (if pageSize and pageNum are not provided, they will be set to default values)
        let { pageSize = 3, pageNum = 1, dateFrom, dateTo } = req.query;

        pageNum = parseInt(pageNum, 10);
        if (isNaN(pageNum) || pageNum < 1) {
            pageNum = 1;
        }

        const DocToSkip = (pageNum - 1) * pageSize;

        let filter = {
            merchantId: id,
        }

        // console.log("filter initially - ", filter);

        // If both starting and ending dates are provided:
        if (dateFrom && dateTo) {
            filter.dateAndTime = { $gte: dateFrom, $lte: dateTo }
        }

        // If ending date is not provided, dateFrom is set to provided date and results till current date will be fetched:
        if (dateFrom && !dateTo) {
            filter.dateAndTime = { $gte: dateFrom /*,$lte: Date.now() */ }
        }

        // If starting date is not provided, results will be from the date when transactions have been done:
        if (!dateFrom && dateTo) {
            filter.dateAndTime = { $lte: dateTo }
        }

        // if (dateFrom && dateTo) {
        //     const startDate = new Date(dateFrom);
        //     const endDate = new Date(dateTo);
        //     if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        //         filter.dateAndTime = { $gte: startDate, $lte: endDate };
        //     }
        // }

        // console.log("filter updated = ", filter);

        // FETCHING ALL TRANSACTIONS AND COUNTING TOTAL: 
        const allTransactions = await Payment.find(filter);
        const allCount = allTransactions.length;

        // FINDING REQUIRED NUMBER OF TRANSACTIONS ACCORDING TO FILTERS
        const result = await Payment.find(filter).skip(DocToSkip).limit(pageSize);
        // console.log(result.length)


        // If no transactions found for a user: 
        // if (allTransactions.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No transactions found for user.."
        //     })
        // }
        // if (result.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No transactions found"
        //     })
        // }

        return res.status(200).json({
            success: true,
            message: "Transactions found",
            allCount,       // Counting total number of documents found
            result          // Documents that match according to filters (if provided)
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