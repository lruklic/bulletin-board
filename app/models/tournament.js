var mongoose = require('mongoose');

var tournamentSchema = mongoose.Schema({
    id : Number,
    details : {
        category : String,
        format : String
    },
    status : {
        phase : String,
        until : String
    },
    name : String,
    registeredUsers : Array,
    matches : Array
});

module.exports = mongoose.model('Tournament', tournamentSchema);