const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    name: { type: String, required: true },
    website: { type: String, required: true },
    color: { type: String, required: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true },
);

module.exports = mongoose.model('Collection', collectionSchema);
