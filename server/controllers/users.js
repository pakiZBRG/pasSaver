const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.getKeyPass = async (req, res) => {
    const email = req.body.email;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }

    try {
        const emailExists = await User.findOne({ email })
        if(emailExists) {
            return res.status(409).json({ error: 'This email is used. Please, take another one.' })
        }             
        
        // Configuring token
        const token = jwt.sign(
            { email },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: 900 }
        )

        // Send activation link to user email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Setup yout unique keyPass",
            html: `
                <h3>Please Click on Link to setup your keyPass:</h3>
                <p>${process.env.CLIENT_URL}/activate/${token}</p>
                <hr/>
            `
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
                return res.json({ message: `Email has been sent to ${email}` });
            }
        });
    } catch(err) {
        return res.status(400).json({ error: err.message });
    }
}

exports.activate = (req, res) => {
    const token = req.params.token;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
        if(err) {
            return res.status(409).json({ error: 'Token has expired. Please, send another email.' })
        }
        const { email } = decoded;
        
        try {
            if(email) {
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const firstError = errors.array().map(error => error.msg)[0]
                    return res.status(422).json({ error: firstError })
                }

                const emailExists = await User.findOne({ email })
                if(emailExists) {
                    return res.status(409).json({ error: 'This email has keyPass. Use another email.' })
                } 

                const keyPass = await bcrypt.hash(req.body.keyPass, 10)
    
                const user = new User({ email, keyPass });
                user.save()
                    .then(() => res.status(201).json({ message: "User created" }))
                    .catch(err => res.status(400).json({ error: err.message }))
            }
        } catch(err) {
            return res.status(400).json({ error: err.message })
        }
    })
}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({error: firstError})
    }

    const keyPass = req.body.keyPass;
    // const yes = await bcrypt.hash(req.body.keyPass, 10);
    // console.log(yes)

    try {
        const findKeyPass = await User.findOne({ keyPass });
    
        if(!findKeyPass) {
            return res.status(404).json({ error: 'KeyPass not found. Please, create one.' });
        }
        const token = jwt.sign({ _id: findKeyPass._id, email: findKeyPass.email }, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '1d'})
    
        return res.json({
            message: "Successful login",
            token
        })
    } catch(err) {
        return res.status(400).json({ error: err.message })
    }
}
