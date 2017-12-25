var DataController = require('../db/data');

module.exports = function () {

    var users = DataController.getUsers();
    var tournament = DataController.getTournament(0);

    Promise.all([users, tournament]).then(values => {
        var users = values[0];
        var tournament = values[1];

        console.log(users);
        console.log(tournament);  
        
        if (tournament.details.format == "ROUND_ROBIN") {
            var matches = roundRobinTournament(tournament);
            console.log(matches);
        }
        
        DataController.generateTournamentMatches(tournament.id, matches); 
    });

    /** Typical Round Robin algorithm, first element with fixed position and rotate the others. */
    function roundRobinTournament(tournament) {
        var matches = [];

        var registeredUsers = tournament.registeredUsers;
        if (registeredUsers.length % 2 == 1) {
            registeredUsers.push("DUMMY");
        }

        var playersCount = registeredUsers.length;

        for (var i = 0; i < playersCount - 1; i++) {
            var firstPlayerFixed = registeredUsers[0];
            var otherPlayers = arrayRotate(registeredUsers.slice(1), i);
            otherPlayers.unshift(firstPlayerFixed);

            for (var j = 0; j < playersCount / 2; j++) {
                var match = {};
                match.id = makeid(6);
                match.player1 = otherPlayers[j];
                match.player2 = otherPlayers[playersCount - j - 1];
                match.status = "NOT_PLAYED";
                match.result = {};
                matches.push(match);
            }
        }

        return matches;

    }

    function arrayRotate(arr, count) {
        count -= arr.length * Math.floor(count / arr.length)
        arr.push.apply(arr, arr.splice(0, count))
        return arr;
    };

    function makeid(numberOfChar) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for (var i = 0; i < (numberOfChar - 1); i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }
}