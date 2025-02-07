const nodemailer = require('nodemailer');
const EmailSender = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jayantarora123a@gmail.com',
            pass: 'wice ftqo gvcm uwst'
        }
    });

    const mailOptions = {
        from: 'jayantarora123a@gmail.com',
        to: `${email}`,
        subject: 'Verify Your Email',
        html: `<p>This is your OTP Passcode ${otp}</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports=EmailSender