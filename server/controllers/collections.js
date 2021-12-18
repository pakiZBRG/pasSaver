const Collection = require('../models/Collection');
const Password = require('../models/Password');
const { deleteImage } = require('../helpers/deleteImage');
const { validationResult } = require('express-validator');

exports.getCollections = (req, res) => {
    const user = req.params.user.replace('"', '')

    Collection
        .find({ user })
        .populate('passwords')
        .then(coll => {
            res.status(200).json({
                count: coll.length,
                collections: coll
            })
        })
        .catch(err => res.status(500).json({ error: err.message }))
}

exports.newCollection = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({ error: firstError })
    }

    const { name, website, color, user } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(415).json({ error: "Insert image!" });
    }

    if (image.size > 1 * 1024 * 1024) {
        return res.status(415).json({ error: "Image size too big. 1MB is limit." });
    }

    const collection = new Collection({
        name,
        website,
        color,
        user,
        imageUrl: image.path,
    });

    collection.save()
        .then(() => res.status(201).json({ message: "Collection created", collection }))
        .catch(err => res.status(500).json({ error: err.message }))
}

exports.editCollection = (req, res) => {
    const id = req.params.id;
    const { name, website, color } = req.body;
    const image = req.file;

    Collection.findById(id)
        .then(coll => {
            coll.name = name;
            coll.website = website;
            coll.color = color;
            if (image) {
                deleteImage(coll.imageUrl);
                coll.imageUrl = image.path;
            }

            coll.save()
                .then(() => res.status(200).json({ message: "Collection updated" }))
                .catch(err => res.status(500).json({ error: err.message }))
        })
        .catch(err => res.status(500).json({ error: err.message }))
}

exports.removeCollection = async (req, res) => {
    const id = req.params.id;

    try {
        const findCollection = await Collection.findById(id);
        if (findCollection) {
            const passwordCount = await Password.find({ collector: findCollection._id });
            const deleteItsPasswords = await Password.deleteMany({ collector: findCollection._id })
            deleteImage(findCollection.imageUrl)
            const deleteCollection = await Collection.findByIdAndRemove(findCollection._id)
            if (deleteItsPasswords && deleteCollection) {
                const collection = await Collection.find().populate('passwords')
                return res.status(200).json({ message: `Collection and ${passwordCount.length} password(s) are deleted!`, collection })
            }
        } else {
            return res.status(500).json({ error: "This colletion doesn\'t exist" })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}