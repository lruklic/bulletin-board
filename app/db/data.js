var object = {
    tournaments : {
        "1" : {
            type : "TABLE_TENNIS",
            status : {"phase" : "REGISTRATION", "until" : "Oct 15, 2017 23:59:59"},
            name : "Smart Sense Liga", 
            registeredUsers : ["11", "12"],
            
        } 
    },
    users : {
        "11" : {"username" : "lruklic", "fullname" : "Luka Ruklic", "company" : "5x9 networks", "email" : "luka.ruklic@smart-sense.hr"},
        "12" : {"username" : "irubil", "fullname" : "Ivan Rubil", "company" : "Smart Sense", "email" : "ivan.rubil@smart-sense.hr"},
        "13" : {"username" : "pp", "fullname" : "Simon Najman", "company" : "Smart Sense", "email" : "simon@smart-sense.hr"},
        "14" : {"username" : "mjosipovic", "fullname" : "Mladen Josipovic", "company" : "Druga Derivacija", "email" : "mladen@smart-sense.hr"},
    }
}

var User = require('../models/user');
var Tournament = require('../models/tournament');

module.exports = {
    getTournaments : function() {
        return Tournament.find({}).exec();
    },
    getTournament : function(id) {
        return Tournament.find({id : id}).exec();
    },
    addUserToTournament : function(tournamentId, username) {

        var user = User.findOne({username : username}).exec();
        var tournament = Tournament.findOne({id : tournamentId}).exec();

        return Promise.all([user, tournament]).then(values => {
            var user = values[0];
            var tournament = values[1];
            tournament.registeredUsers.push(user.uuid);
            tournament.save();
        });

    },
    removeUserFromTournament : function(tournamentId, username) {

        var user = User.findOne({username : username}).exec();
        var tournament = Tournament.findOne({id : tournamentId}).exec();

        return Promise.all([user, tournament]).then(values => {
            var user = values[0].uuid;
            var tournament = values[1];

            var userIndex = tournament.registeredUsers.indexOf(user);
            if (userIndex != -1) {
                tournament.registeredUsers.splice(userIndex);
            }
            tournament.save();
        });

    },
    getUsers : function() {
        return User.find({}).exec();
    },
    getUser : function(id) {
        return object.users[id];
    },
    getUserByUsername : function(username) {
        return User.findOne({username : new RegExp('^' + username + '$', "i")}).exec();
    }
}