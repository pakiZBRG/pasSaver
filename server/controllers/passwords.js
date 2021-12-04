const Password = require('../models/Password');
const Collection = require('../models/Collection');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateSalt } = require('../helpers/Salting');

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
        /**
         * Hashing the password
         */
        // Convert each character into ASCII code
        const pass = req.body.password.split('');
        let i = pass.length - 1;
        let asciiPass = [];
        while(i > -1){
            const asciiChar = pass[i].charCodeAt(0);
            if(i % 2 == 0){
                asciiPass.push(asciiChar + parseInt(process.env.MOVE_M));
            } else {
                asciiPass.push(asciiChar + parseInt(process.env.MOVE_N));
            }
            i--;
        }

        // Generate salts
        const prefix = generateSalt(process.env.PREFIX);
        const sufix = generateSalt(process.env.SUFIX);

        // Converti ASCII code into character
        let stringPass = [];
        asciiPass.forEach(p => stringPass.push(String.fromCharCode(p)));

        // Combine everything
        const hash = prefix + stringPass.join('') + sufix;

        const { email, collector } = req.body;
        let passId;

        const savedPassword = new Password({
            email,
            password: hash,
            collector
        });

        savedPassword.save()
            .then(pass => {
                passId = pass._id;
                res.status(201).json({ 
                    message: "Password successfully added!",
                    password: pass
                })
            })
            .then(() => {
                Collection.findById(collector)
                    .then(coll => {
                        const updatedPasswords = [...coll.passwords];
                        updatedPasswords.push(passId);
    
                        coll.passwords = updatedPasswords;
                        return coll.save();
                    })
            })
            .catch(err => res.status(500).json({ error: err.message }))
    } catch(err) {
        res.status(400).json({ error: err.message })
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