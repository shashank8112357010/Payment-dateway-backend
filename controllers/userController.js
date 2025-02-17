
const { generateOTP, generateToken } = require("../helper/generate");
const { sendEmail } = require("../helper/sendEmail");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const { otpTemplate } = require("../emailTemplates/otpTemplate");
const e = require("express");
const { upload } = require("../middleware/multer");
const multer = require("multer");
const { uploadImg } = require("../middleware/cloudinary");

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

        // If a user with email already exists in DB: 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists.."
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
        console.log(req.body);
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

        const token = await generateToken(user);
        // console.log("ACCESS TOKEN: ", token);

        // If user provided correct OTP: 
        await OTP.deleteOne({ userId });

        return res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            user,
            token,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// GET USER DETAILS: 
module.exports.getUserDetails = async (req, res) => {
    try {
        // console.log("REQ USER = ", req.user);
        // Getting user id: 
        const { id } = req.user;
        // console.log("User id: ", id);

        // Getting user's token:
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

        // Finding user: 
        const user = await User.findById(id);
        // If user is not found: 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        // console.log("USER = ", user);

        return res.status(200).json({
            success: true,
            message: "User details fetched",
            user,
            token: JWT_TOKEN
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// EDIT USER DETAILS AND UPLOAD PROFILE: 
module.exports.editProfile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: "File size too large.. Maximum size should be 1MB only!!",
                error: true,
            })
        }
        else if (err) {
            return res.status(400).json({
                success: false,
                message: "Error uploading image",
                error: err,
            })
        }
        try {
            const { id } = req.user;
            // console.log("id = ", id);

            const { fullName, mobileNumber, email, preferredLanguage, address } = req.body;

            // Finding the user: 
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            user.fullName = fullName !== undefined ? fullName : user.fullName;
            user.mobileNumber = mobileNumber !== undefined ? mobileNumber : user.mobileNumber;
            user.preferredLanguage = preferredLanguage !== undefined ? preferredLanguage : user.preferredLanguage;
            user.address = address !== undefined ? address : user.address

            // Check if email is being attempted to update
            if (email && email !== user.email) {
                // Log the attempt or return an error
                return res.status(400).json({
                    success: false,
                    message: "Email cannot be modified",
                });
            }

            if (req.file) {
                try {
                    const result = await uploadImg(req.file.path);
                    if (result.success) {
                        user.profileImg = {
                            key: result.public_id,
                            url: result.secure_url,
                        }
                    } else {
                        return res.status(500).json({
                            success: false,
                            message: 'Image upload failed',
                            error: result.message
                        })
                    }
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Image upload failed',
                        error: error.message
                    });
                }

                // await user.save();
            }

            await user.save();

            return res.status(200).json({
                success: true,
                message: "User Profile Updated Successfully",
                user
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
    )
}