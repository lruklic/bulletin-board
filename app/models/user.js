var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email : String,
    username : String,
    password : String,
    company : String,
    firstName : String,
    lastName : String
});

module.exports = mongoose.model('User', userSchema);