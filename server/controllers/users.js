const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../helpers/emailSender')
const { validationResult } = require('express-validator');

exports.getKeyPass = async (req, res) => {
    const email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }

    try {
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return res.status(409).json({ error: 'This email is used. Please, take another one.' })
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: 900 }
        )

        const html = `
            <h3>Please Click on Link to setup your keyPass:</h3>
            <p>${process.env.CLIENT_URL}/activate/${token}</p>
            <hr/>
        `

        sendEmail(email, html, res);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.activateKeyPass = (req, res) => {
    const token = req.params.token;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
        if (err) {
            return res.status(409).json({ error: 'Token has expired. Please, send another email.' })
        }
        const { email } = decoded;

        try {
            if (email) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const firstError = errors.array().map(error => error.msg)[0]
                    return res.status(422).json({ error: firstError })
                }

                const emailExists = await User.findOne({ email })
                if (emailExists) {
                    return res.status(409).json({ error: 'This email has keyPass. Use another email.' })
                }

                const keyPass = await bcrypt.hash(req.body.keyPass, 10)

                const user = new User({ email, keyPass });
                user.save()
                    .then(() => res.status(201).json({ message: "User created" }))
                    .catch(err => res.status(500).json({ error: err.message }))
            }
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    })
}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }

    const { email, keyPass } = req.body.login;

    try {
        const findKeyPass = await User.findOne({ email });

        if (!findKeyPass) {
            return res.status(404).json({ error: 'Invalid credentails.' });
        }

        const hashPwd = await bcrypt.compare(keyPass, findKeyPass.keyPass);

        if (hashPwd) {
            const token = jwt.sign({ _id: findKeyPass._id, email: findKeyPass.email }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '1d' })

            return res.json({
                message: "Successful login",
                token
            })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.findEditModeKey = async (req, res) => {
    try {
        const email = req.body.email;
        const emailExists = await User.find({ email });
        if (!emailExists) {
            return res.status(409).json({ error: 'This email doesn\'t exist. Please, take another one.' })
        }

        if (!emailExists.editModeKey) {
            return res.status(200).json({ exists: false })
        } else {
            return res.status(200).json({ exists: true })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.getEditModeKey = async (req, res) => {
    try {
        const email = req.body.email;
        const emailExists = await User.find({ email })
        if (!emailExists) {
            return res.status(409).json({ error: 'This email doesn\'t exist. Please, take another one.' })
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: 900 }
        )

        const html = `
            <h3>Please Click on Link to setup your editKeyPass:</h3>
            <p>${process.env.CLIENT_URL}/activate/${token}</p>
            <hr/>
        `

        sendEmail(email, html, res)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}