const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    collector: { type: Schema.Types.ObjectId, ref: "Collection", required: true }
}, { timestamps: true },
);

module.exports = mongoose.model('Password', passwordSchema);