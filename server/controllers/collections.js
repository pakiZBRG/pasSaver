const Collection = require('../models/Collection');
const { deleteImage } = require('../helpers/deleteImage');
const { validationResult } = require('express-validator');

exports.getCollections = (req, res) => {
    Collection.find()
        .then(coll => {
            res.status(200).json({
                count: coll.length,
                collections: coll
            })
        })
}

exports.newCollection = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({error: firstError})
    }
    
    const { name, website } = req.body;
    const image = req.file;

    if(!image){
        return res.status(415).json({error: "Insert image"});
    }

    if(image.size > 1*1024*1024){
        return res.status(415).json({error: "Image size too big. Upto 1MB"});
    }

    const collection = new Collection({
        name,
        website,
        imageUrl: image.path,
    });

    collection.save()
        .then(() => res.status(201).json({ message: "Collection created", collection }))
        .catch(err => res.status(400).json({error: err.message}))
}

exports.editCollection = (req, res) => {
    const id = req.params.id;
    const { name, website } = req.body;
    const image = req.file;

    Collection.findById(id)
        .then(coll => {
            coll.name = name;
            coll.website = website;
            if(image) {
                deleteImage(coll.imageUrl);
                coll.imageUrl = image.path;
            }
            
            coll.save()
                .then(() => res.status(200).json({ message: "Product updated" }))
                .catch(err => res.status(500).json({err: err}))
        })
        .catch(err => res.status(500).json({err: err}))
}

exports.removeCollection = (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).json({err: "Collection with given ID is non-existent"});
    }

    Collection.findByIdAndRemove(id)
        .then(coll => {
            deleteImage(coll.imageUrl);
            res.status(200).json({message: "Collection is deleted"})
        })
        .catch(err => res.status(500).json({err: err.message}));
}