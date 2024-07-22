
const nodemailer = require("nodemailer");
require("dotenv").config();
const { otpTemplate } = require("../emailTemplates/otpTemplate");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
})

const sendEmail = async (to, subject, fullName, otp) => {

    htmlToSend = otpTemplate(fullName, otp);

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        // text: text,
        html: htmlToSend
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("EMAIL SENT SUCCESSFULLY!!")
    } catch (error) {
        console.log("Error sending email: ", error);
    }
}

module.exports = { sendEmail };