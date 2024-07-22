const { text } = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
})

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("EMAIL SENT SUCCESSFULLY!!")
    } catch (error) {
        console.log("Error sending email: ", error);
    }
}

module.exports = { sendEmail };