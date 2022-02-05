const Password = require('../models/Password');
const Collection = require('../models/Collection');
const { validationResult } = require('express-validator');
const { hashPassword } = require('../helpers/Hashing');

exports.getPasswords = (req, res) => {
    Password.find()
        .then(pass => {
            res.status(200).json({
                count: pass.length,
                passwords: pass
            })
        })
        .catch(err => res.status(500).json({ error: err.message }))
}

exports.filterPasswords = async (req, res) => {
    try {
        const email = req.params.email;
        const collections = await Collection.find().populate('passwords');

        const coll = collections.filter(collection => collection.passwords.find(password => password.email.includes(email)));

        coll.forEach(c => c.passwords.filter(password => {
            if (!password.email.includes(email)) {
                c.passwords.splice(c.passwords.indexOf(password), 1)
            }
        }));

        return res.status(200).json({ collections: coll });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.newPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }

    try {
        const { email, collector, password, loggedUser } = req.body;
        const savedPassword = new Password({
            email,
            password: hashPassword(password),
            collector
        });

        try {
            const savePassword = await savedPassword.save();
            if (savePassword) {
                const collection = await Collection.findById(collector);
                const updatedPasswords = [...collection.passwords];
                updatedPasswords.push(savePassword._id);
                collection.passwords = updatedPasswords;
                await collection.save();

                const collections = await Collection.find({ user: loggedUser }).populate('passwords')
                return res.status(201).json({
                    message: "Password successfully added!",
                    collections
                })
            }
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.editPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }

    const id = req.params.id;
    const { email, password, loggedUser } = req.body;

    Password
        .findById(id)
        .then(pass => {
            pass.email = email;
            pass.password = hashPassword(password);

            pass.save()
                .then(async () => {
                    const collection = await Collection.find({ user: loggedUser }).populate('passwords');
                    return res.status(200).json({ message: "Password updated", collection })
                })
                .catch(err => res.status(500).json({ error: err.message }))
        })
        .catch(err => res.status(500).json({ error: err.message }))
}

exports.removePassword = async (req, res) => {
    const id = req.params.id;
    const user = req.query.user;

    try {
        const findPassword = await Password.findById(id);
        if (findPassword) {
            const updateColl = await Collection.updateOne(
                { _id: findPassword.collector },
                { $pull: { passwords: findPassword._id } }
            );
            const deletePassword = await Password.findByIdAndRemove(findPassword._id);
            if (deletePassword && updateColl) {
                const collections = await Collection.find({ user }).populate('passwords');
                return res.status(200).json({ message: "Password is deleted.", collections });
            }
        } else {
            return res.status(500).json({ error: 'This password doesn\'t exist' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}