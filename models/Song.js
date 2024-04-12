const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    _id: {
        type: Object, required: true
    },
    name: {
        type: String, required: true
    },
    lyric: {
        type: String, required: true
    },
    composerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Composer', required: true
    },
    tags: {
        type: Array, ref: 'Tag', required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }
});

module.exports = mongoose.model('Song', SongSchema);