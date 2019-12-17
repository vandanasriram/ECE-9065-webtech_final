const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId: String,
    createdDate: String,
    value: String,
    visibility: String,
    songId: String,
    rating: String
}, {
    timestamps: true,
    collection: 'review'
});

module.exports = mongoose.model('review', ReviewSchema);