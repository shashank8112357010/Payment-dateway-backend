module.exports.otpTemplate = (fullName, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DashPay Verification Code</title>
        <style>
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px !important;
            }

            .code div {
                font-size: 24px !important;
                padding: 5px 10px !important;
            }

            .footer p {
                font-size: 10px !important;
            }
        }
    </style>
    </head>

    <body style="font-family: Arial, sans-serif;  margin: 0; min-height:100vh; padding: 0;">
        <div class="container" style="width: 100%; max-width: 600px; border: 2px solid gray; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
            <div style="text-align: left; padding-bottom: 20px;">
                <h1 style="color: #0F4D73; font-weight: 900;">DashPay</h1>
            </div>
            <div style="text-align: left;">
                <h1 style="font-size: 24px; color: #333333;">Confirm Verification Code</h1>
                <p style="font-size: 16px; color: #666666;">Hi ${fullName},</p>
                <p style="font-size: 16px; color: #666666;">This is your verification code:</p>
                <div style="display: flex; justify-content: center; margin: 20px 0;">
                ${Array.from(String(otp)).map(digit => `
                    <div style="font-size: 32px; font-weight: bold; color: #0F4D73; border: 2px solid #0F4D73; padding: 10px 20px;  margin: 0 5px; border-radius: 5px;">
                        ${digit}
                    </div>
                `).join('')}
                </div>
                <p style="font-size: 16px; color: #666666;">This code will only be valid for the next 2 minutes.</p>
                <p style="font-size: 16px; color: #666666;">Thanks,<br>DashPay</p>
            </div>
            <div class="footer" style="text-align: center; font-size: 12px; color: #999999; padding-top: 20px; border-top: 1px solid #eeeeee;">
                <p>&copy; 2024 DashPay. All rights reserved.</p>
                <p>You are receiving this mail because you registered to join the DashPay platform as a user. This also shows that you agree to our <a href="#" style="color: #0F4D73; text-decoration: none;">Terms of Use</a> and <a href="#" style="color: #0F4D73; text-decoration: none;">Privacy Policies</a>. If you no longer want to receive mails from us, click the unsubscribe link below to unsubscribe.</p>
            </div>
        </div>
    </body>

    </html>
    `
}
