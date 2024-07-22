const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    amount: {
        type: String,
        require: true,
    },
    currency: {
        type: String,
        required: true,
        enum: ["INR", "USD"],
        default: "INR"
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    validThru: {
        type: Date,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
    nameOnCard: {
        type: String,
        required: true
    }
})


const paymentModel = mongoose.model('paymentModel', paymentSchema);

module.exports = paymentModel;