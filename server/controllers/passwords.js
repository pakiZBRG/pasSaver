const Password = require('../models/Password');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.getPasswords = (req, res) => {
    Password.find()
        .then(pass => {
            res.status(200).json({
                count: pass.length,
                passwords: pass
            })
        })
        .catch(err => res.status(400).json({ error: err.message }))
}

exports.newPassword = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }
    
    try {
        const { email, password, collector } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const savedPassword = new Password({
            email,
            password: hashPassword,
            collector
        });

        savedPassword.save()
            .then(() => res.json({ message: 'Password created', savedPassword }))
            .catch(err => res.status(400).json({ error: err.message }));
    } catch(err) {
        return res.status(400).json({ error: err.message })
    }
}

exports.editPassword = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({error: firstError})
    }

    const id = req.params.id;
    const { email, password, collector } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    Password.findById(id)
        .then(pass => {
            pass.email = email;
            pass.password = hashPassword;
            pass.collector = collector;
            
            pass.save()
                .then(() => res.status(200).json({ message: "Password updated" }))
                .catch(err => res.status(500).json({ error: err.message }))
        })
        .catch(err => res.status(500).json({ error: err.message }))
}

exports.removePassword = async(req, res) => {
    const id = req.params.id;

    try {
        const findPassword = await Password.findById(id);
        if(findPassword) {
            const deletePassword = await Password.findByIdAndRemove(findPassword._id);
            deletePassword && res.status(200).json({ message: "Password is deleted" });
        } else {
            return res.status(500).json({ error: 'This password doesn\'t exist' });
        }
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}