var object = {
    tournaments : {
        "1" : {
            type : "TABLE_TENNIS",
            status : {"phase" : "REGISTRATION", "until" : "Oct 15, 2017 23:59:59"},
            name : "Smart Sense Liga", 
            registeredUsers : ["11", "12"]
        } 
    },
    users : {
        "11" : {"username" : "lruklic", "fullname" : "Luka Ruklic", "company" : "5x9 networks", "email" : "luka.ruklic@smart-sense.hr"},
        "12" : {"username" : "irubil", "fullname" : "Ivan Rubil", "company" : "Smart Sense", "email" : "ivan.rubil@smart-sense.hr"},
        "13" : {"username" : "snajman", "fullname" : "Simon Najman", "company" : "Smart Sense", "email" : "simon@smart-sense.hr"},
        "14" : {"username" : "mjosipovic", "fullname" : "Mladen Josipovic", "company" : "Druga Derivacija", "email" : "mladen@smart-sense.hr"},
    }
}

var User = require('../models/user');

module.exports = {
    getTournaments : function() {
        return object.tournaments;
    },
    getTournament : function(id) {
        return object.tournaments[id];
    },
    getUsers : function() {
        return object.users;
    },
    getUser : function(id) {
        return object.users[id];
    },
    getUserByUsername : function(username) {
        return User.findOne({username : new RegExp('^' + username + '$', "i")}).exec();
    }
}