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
            <div className='center'>
                <div className='black-card'>
                    <div className='black-card-header'>
                        <h3>Link for keyPass</h3>
                    </div>
                    <div className='black-card-content'>
                        <p>Click on the link below to continue with setting up you keyPass, in order to view your passwords and collections.</p>
                        <a href='${process.env.PUBLIC_URL}/activate/${token}'>Setup keyPass</a>
                        <small>Password Collector</small>
                    </div>
                </div>
            </div>
        `;

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
                    .then(() => res.status(201).json({ message: "User registered" }))
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
        const hashPwd = await bcrypt.compare(keyPass, findKeyPass.keyPass);
        
        if (!findKeyPass || !hashPwd) {
            return res.status(403).json({ error: 'Invalid credentails.' });
        }


        if (hashPwd) {
            const token = jwt.sign({ id: findKeyPass._id, email: findKeyPass.email }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '30d' })

            return res.json({
                message: "Successful login",
                token
            })
        } else {
            return res.status(403).json({ error: 'Invalid credentails.' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.findEditModeKey = async (req, res) => {
    try {
        const emailExists = await User.findById(req.params.id);

        if ('editKey' in emailExists) {
            return res.status(200).json({ exists: true })
        } else {
            return res.status(200).json({ exists: false })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.getEditModeKey = async (req, res) => {
    try {
        const emailExists = await User.findById(req.body.id)

        if (!emailExists) {
            return res.status(409).json({ error: 'This email doesn\'t exist. Please, take another one.' })
        }

        const token = jwt.sign(
            { email: emailExists.email, mode: 'editMode' },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: 900 }
        )

        const html = `
            <div className='center'>
                <div className='black-card'>
                    <div className='black-card-header'>
                        <h3>Link for editKeyPass</h3>
                    </div>
                    <div className='black-card-content'>
                        <p>Click on the link below to continue with setting up you editKeyPass, in order to create, update and remove passwords and collections.</p>
                        <a href='${process.env.PUBLIC_URL}/activate/${token}'>Setup EditKey</a>
                        <small>Password Collector</small>
                    </div>
                </div>
            </div>
        `;

        sendEmail(emailExists.email, html, res)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.activateEditMode = async (req, res) => {
    const token = req.params.token;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
        if (err) {
            return res.status(409).json({ error: 'Token has expired. Please, send another email.' })
        }
        const { email } = decoded;

        try {
            if (email) {
                const emailExists = await User.findOne({ email })
                if (emailExists.editKey) {
                    return res.status(409).json({ error: 'This email has editKey. Use another email.' })
                }

                const editKey = await bcrypt.hash(req.body.editKey, 10)

                emailExists.editKey = editKey
                emailExists.save()
                    .then(() => res.status(201).json({ message: "Edit Key created" }))
                    .catch(err => res.status(500).json({ error: err.message }))
            }
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    })
}

exports.turnOnEditMode = async (req, res) => {
    try {
        const findEditMode = await User.findById(req.params.id);

        const hashKey = await bcrypt.compare(req.body.key, findEditMode.editKey);

        if (hashKey) {
            return res.status(200).json({ message: "Successful activation", editable: findEditMode.editKey })
        } else {
            return res.status(403).json({ error: 'Wrong key.' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const emailExists = await User.findOne({ email: req.body.email })

        if (!emailExists) {
            return res.status(409).json({ error: 'This email doesn\'t exist. Please, take another one.' })
        }

        const token = jwt.sign(
            { email: emailExists.email },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: 900 }
        )

        const html = `
            <div className='center'>
                <div className='black-card'>
                    <div className='black-card-header'>
                        <h3>Recover your password</h3>
                    </div>
                    <div className='black-card-content'>
                        <p>Click on the link below to proceed with recovering your password.</p>
                        <a href='${process.env.PUBLIC_URL}/reset/${token}'>Reset Password</a>
                        <small>Password Collector</small>
                    </div>
                </div>
            </div>
        `;

        sendEmail(emailExists.email, html, res)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashKeyPass = await bcrypt.hash(password, 10)
        await User.updateOne(
            { email },
            { $set: { keyPass: hashKeyPass } }
        );

        return res.status(200).json({ message: "Password successfully reseted!" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.recoverEditKey = async (req, res) => {
    try {
        const emailExists = await User.findById(req.body.id)

        if (!emailExists) {
            return res.status(409).json({ error: 'This email doesn\'t exist. Please, take another one.' })
        }

        const token = jwt.sign(
            { email: emailExists.email },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: 900 }
        )

        const html = `
            <div className='center'>
                <div className='black-card'>
                    <div className='black-card-header'>
                        <h3>Recover your editKey</h3>
                    </div>
                    <div className='black-card-content'>
                        <p>Click on the link below to proceed with reseting your editKey.</p>
                        <a href='${process.env.PUBLIC_URL}/recover/${token}'>Recover editKey</a>
                        <small>Password Collector</small>
                    </div>
                </div>
            </div>
        `;

        sendEmail(emailExists.email, html, res)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.resetEditKey = async (req, res) => {
    const { email, editKey } = req.body;

    try {
        const hashEditKey = await bcrypt.hash(editKey, 10);

        await User.updateOne(
            { email },
            { $set: { editKey: hashEditKey } }
        );

        return res.status(200).json({ message: "EditKey successfully reseted!" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}