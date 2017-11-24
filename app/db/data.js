var User = require('../models/user');
var Tournament = require('../models/tournament');
var MealMenu = require('../models/mealmenu');

module.exports = {
    getTournaments : function() {
        return Tournament.find({}).exec();
    },
    getTournament : function(id) {
        return Tournament.findOne({id : id}).exec();
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
    uploadTournamentResult : function(tournamentId, username, matchId, result) {
        var user = User.findOne({username : username}).exec();
        var tournament = Tournament.findOne({id : tournamentId}).exec();

        return Promise.all([user, tournament]).then(values => {
            var user = values[0].uuid;
            var tournament = values[1];
        
            for (var i = 0; i < tournament.matches.length; i++) {
                if (tournament.matches[i].id == matchId) {
                    var updateMatch = tournament.matches[i];
                    updateMatch.status = "NOT_CONFIRMED";
                    updateMatch.result = {"score" : result, "submittedBy" : user};
                    tournament.matches.set(i, updateMatch);                    
                    tournament.save();
                    break;
                }
            };
        });
    },
    generateTournamentMatches : function(tournamentId, matches) {
        Tournament.findOne({id : tournamentId}).then(function(tournament) {
            tournament.matches = matches;
            tournament.save();
        });
    },
    getUsers : function() {
        return User.find({}).exec();
    },
    getUserByUsername : function(username) {
        return User.findOne({username : new RegExp('^' + username + '$', "i")}).exec();
    },
    getMealMenus : function(restaurant) {
        return MealMenu.find({'restaurant' : restaurant}).sort({date: 'desc'}).exec();
    }
}