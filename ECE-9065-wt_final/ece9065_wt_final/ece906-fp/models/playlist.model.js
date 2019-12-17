const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    title: String,
    description: String,
    userId: String,
    visibility: String,
    songs: Array
}, {
    timestamps: true,
    collection: 'playlist'
});

module.exports = mongoose.model('playlist', PlaylistSchema);