const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const SongSchema = new Schema({
    head: String,
    title: String,
    artist: String,
    album: String,
    year: String,
    comment: String,
    'zero-byte': String,
    track: Number,
    genre: String,
    description: String,
    createdByUser: String,
    visibility: Boolean

}, {
    timestamps: true,
    collection: 'song' 
});

module.exports = mongoose.model('song', SongSchema);