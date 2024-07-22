
const { generateOTP } = require("../helper/generate");
const { sendEmail } = require("../helper/sendEmail");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const { otpTemplate } = require("../emailTemplates/otpTemplate");

// USER REGISTRATION: 
module.exports.register = async (req, res) => {
    try {
        // Getting user details: 
        const { fullName, mobileNumber, email, address, preferredLanguage, registrationNumber, companyAddress } = req.body;

        // if any detail is missing: 
        if (!fullName || !mobileNumber || !email || !address || !preferredLanguage || !registrationNumber || !companyAddress) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields!!"
            })
        }

        // Saving user's data: 
        const user = await User.create({
            fullName,
            mobileNumber,
            email,
            address,
            preferredLanguage,
            registrationNumber,
            companyAddress
        })

        return res.status(201).json({
            success: true,
            message: "Registration Successful!!",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// LOGIN: 
module.exports.login = async (req, res) => {
    try {
        // getting users' email: 
        const { email } = req.body;
        // if user does not provide email: 
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Provide Email"
            })
        }

        // finding user with email: 
        const user = await User.findOne({ email });
        // user is not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!!"
            })
        }

        // Generating OTP for user: 
        const providedOTP = await generateOTP();

        // Deleting all previous OTPs (if present): 
        await OTP.deleteMany({ userId: user._id });

        // saving the newly generated OTP in OTP DB: 
        const otpDoc = new OTP({
            userId: user._id,
            otpCode: providedOTP,
        })
        await otpDoc.save();

        // console.log("USER: ", user);
        // console.log("FULLNAME: ", user.fullName);

        // const htmlToSend = otpTemplate(user.fullName, providedOTP);
        await sendEmail(
            email,
            "OTP For Login",
            // htmlToSend
            user.fullName,
            providedOTP
        )

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
            userId: user._id,
        })
    } catch (error) {
        // console.log("LOGIN CATCH ERRORRR ")
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// VERIFYING USER'S OTP: 
module.exports.verifyOTP = async (req, res) => {
    try {
        // Getting user id and otp: 
        const { userId } = req.params;
        const { otp } = req.body;

        // if user id is not found: 
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Id required"
            });
        }

        // if otp is not provided: 
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Provide OTP",
            })
        }

        // fiinding user's otp document in DB: 
        const userOTP = await OTP.findOne({ userId });
        if (!userOTP) {
            return res.status(410).json({
                success: false,
                message: "OTP Expired"
            })
        }

        // Incorrect OTP: 
        if (userOTP.otpCode !== otp) {
            return res.status(401).json({
                success: false,
                message: "Incorrect OTP"
            })
        }

        // Finding user: 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // If user provided correct OTP: 
        await OTP.deleteOne({ userId });

        return res.status(200).json({
            success: true,
            message: "Logged In Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}