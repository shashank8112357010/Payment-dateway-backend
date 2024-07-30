const { body } = require("express-validator");
const userModel = require("../models/userModel");

module.exports.registerValidator = [
    body("fullName")
        .notEmpty().withMessage("Full name is required"),

    body("mobileNumber")
        .notEmpty().withMessage("Provide mobile number")
        .isLength({ min: 10, max: 10 }).withMessage("Mobile number must be 10 digit long"),

    body("email")
        .notEmpty().withMessage("Provide email")
        .isEmail().withMessage("Provide valid email")
        .custom(async (value) => {
            const existingUser = await userModel.findOne({ email: value });
            if (existingUser) {
                throw new Error("User with this email already exists!!")
            }
        }),

    body("address")
        .notEmpty().withMessage("Provide address"),

    body("registrationNumber")
        .notEmpty().withMessage("Registration number is needed"),

    body("companyAddress")
        .notEmpty().withMessage("Provide company address")
]

module.exports.loginValidator = [
    body("email")
        .notEmpty().withMessage("Provide email to login!!")
        .isEmail().withMessage("Provide valid email")
]