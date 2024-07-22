
module.exports.generateOTP = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP : ", otpCode);
    return otpCode;
}