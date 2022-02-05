const nodemailer = require('nodemailer');

exports.sendEmail = (email, html, res) => {
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Setup your key",
        html
    }

    const transport = {
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.PASSWORD_FROM
        }
    };
    const transporter = nodemailer.createTransport(transport);

    transporter.verify((err, success) => {
        if(err) {
            console.log("Error:", err);
        } else {
            console.log("Server is ready to take messages");
        }
    });

    transporter.sendMail(emailData, function(err, info){
        if(err) {
            console.log(err);
        } else {
            console.log(`Email send to ${info.accepted}`);
            return res.status(200).json({ message: `Email has been sent to ${email}` });
        }
    });
    return res.status(200).json({ message: `Email has been sent to ${email}` });
}