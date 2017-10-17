var mongoose = require('mongoose');

var tournamentSchema = mongoose.Schema({
    id : Number,
    type : String,
    status : {
        phase : String,
        until : String
    },
    name : String,
    registeredUsers : Array
});

module.exports = mongoose.model('Tournament', tournamentSchema);