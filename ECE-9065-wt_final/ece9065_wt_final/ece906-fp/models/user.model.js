const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    name: String,
    salt: String,
    accountType: String,
    emailVerified: Boolean,
    userType: String,
    signUpMethod: String
}, {
    timestamps: true,
    collection: 'user'
});

module.exports = mongoose.model('user', UserSchema);