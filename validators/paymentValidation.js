const { body } = require("express-validator");
const paymentModel = require("../models/paymentModel");


module.exports.paymentValidator = [
    body("amount")
        .notEmpty().withMessage("Please enter the amount to be paid"),

    // body("currency")
    //     .notEmpty().withMessage("Provide currency")
    //     .isLength({ min: 1, max: 3 }).withMessage("Length of currency must be 1 to 3"),

    body("firstName")
        .notEmpty().withMessage("Provide first name")
        .isLength({ min: 2, max: 30 }).withMessage("First name can not be shorter than 3 characters or longer than 30 characters"),

    body("lastName")
        .notEmpty().withMessage("Provide last name")
        .isLength({ min: 2, max: 30 }).withMessage("Last name can not be shorter than 2 characters or longer than 30 characters"),

    body("country")
        .notEmpty().withMessage("Country must not be empty")
        .isLength({ min: 3, max: 30 }).withMessage("Country name can not be shorter than 3 characters or longer than 30 characters"),

    body("phoneNo")
        .notEmpty().withMessage("Provide Phone number")
        .isLength({ min: 10, max: 10 }).withMessage("Phone number must be 10 digit long"),

    body("email")
        .notEmpty().withMessage("Provide email")
        .isEmail().withMessage("Provide valid email"),

    body("address")
        .notEmpty().withMessage("Provide Address"),

    body("cardNumber")
        .notEmpty().withMessage("Card number must be provided")
        .isLength({ min: 16, max: 16 }).withMessage("Provide 16 digit card number without space")
        .isNumeric().withMessage("Only numbers allowed"),

    body("cardExpiry")
        .notEmpty().withMessage("Provide the card expiry date")
        .matches(/^(0[1-9]|1[0-2])\/\d{4}$/).withMessage("Expiry date must be in MM/YYYY format"),

    body("cvv")
        .notEmpty().withMessage("Provide CVV")
        .isLength({ min: 3, max: 3 }).withMessage("CVV should be of 3 digits"),

    body("nameOnCard")
        .notEmpty().withMessage("Provide the name on card")
]
