const mongoose = require('mongoose');
const BCrypt = require('../utils/BCrypt');
const Schema = mongoose.Schema;

const UserDataSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, unique: true,  dropDups: true},
    password: {type: String, required: true},
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('User', UserDataSchema);