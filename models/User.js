const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, required: true
    },
    name: String,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
});

const UserSchema = new mongoose.Schema({
    _id: {
        type: Object, required: true
    },
    name: {
        type: String, required: true
    },
    last_name: {
        type: String, required: true
    },
    user_name: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    level: {
        type: Number, required: true
    },
    lists: [listSchema]
});

module.exports = mongoose.model('User', UserSchema);