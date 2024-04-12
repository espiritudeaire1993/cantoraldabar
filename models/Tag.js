const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    _id: { type: Object, required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('Tag', tagSchema);