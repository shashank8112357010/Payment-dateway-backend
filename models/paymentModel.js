const mongoose = require("mongoose");
const Schema = mongoose.Schema

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
    address: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    validThru: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
    nameOnCard: {
        type: String,
        required: true
    },
    dateAndTime: {
        type: String,
        // default: Date.now,
    },
    mode: {
        type: String,
        enum: ["Credit Card", "Crypto", "Open Bank"],
        default: "Credit Card"
    },
    status: {
        type: String,
        enum: ["Completed", "Pending", "Cancelled"],
    },
    merchantId: {
        type: Schema.Types.ObjectId,
        ref: 'userModel'
    }
})


const paymentModel = mongoose.model('paymentModel', paymentSchema);

module.exports = paymentModel;