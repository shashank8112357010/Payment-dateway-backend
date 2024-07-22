const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    address: {
        type: String,
        required: true,
    },
    preferredLanguage: {
        type: String,
        enum: ["English", "Hindi"]
    },
    registrationNumber: {
        type: String,
        required: true,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    // passportNumber: {
    //     type: String,
    //     required: true,
    // },
    // accountNumber: {
    //     type: String,
    //     required: true,
    // },
    // swiftCode: {
    //     type: String,
    //     required: true,
    // },
    // bankAddress: {
    //     type: String,
    //     required: true,
    // },
    // recipientName: {
    //     type: String,
    //     required: true,
    // }
})

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;