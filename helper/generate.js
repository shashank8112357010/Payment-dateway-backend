const jwt = require("jsonwebtoken");

module.exports.generateOTP = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP : ", otpCode);
    return otpCode;
}

module.exports.generateToken = async (user) => {
    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );
    return token;
}