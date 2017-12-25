var DataController = require('./db/data');

var User = require('./models/user');

var MealDaemon = require('./daemons/mealDaemon.js')

var passportConfig = require("../config/passport");
var moment = require("moment");

module.exports = function (app, path, passport) {

    app.get("/tournaments", isLoggedIn, function (req, res) {
        DataController.getTournaments().then(function(tournaments) {
            res.json(tournaments);
        });
    });

    app.get("/tournament/:id", function (req, res) {
        var id = req.params.id;
        DataController.getTournament(id).then(function(tournament) {
            res.json(tournament);            
        });
    });

    app.put("/tournaments/register", function(req, res) {
        var tournamentId = req.body.tournamentId;
        var action = req.body.action;
        var user = req.user;

        if (action == "REGISTER") {
            DataController.addUserToTournament(tournamentId, user.username).then(function() {
                res.json({"action" : action, "userId" : user.uuid});
            });
        } else if (action == "UNREGISTER") {
            DataController.removeUserFromTournament(tournamentId, user.username).then(function() {
                res.json({"action" : action, "userId" : user.uuid});
            });
        }
    });

    app.put("/tournaments/results/upload", function(req, res) {
        var tournamentId = req.body.tournamentId;
        var matchId = req.body.matchId;
        var result = req.body.result;
        var user = req.user;

        DataController.uploadTournamentResult(tournamentId, user.username, matchId, result).then(function() {
            res.json({});
        });

        
    })

    app.get("/profile", function (req, res) {
        var user = req.user;
        if (user) {
            var user = DataController.getUserByUsername(user.username).then(function (user) {
                res.json(user);
            });
        } else {
            res.json({});
        }
    });

    app.get("/users", isLoggedIn, function (req, res) {
        DataController.getUsers().then(function(users) {
            res.json(users);
        });
    });

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname + '/../public/login.html'));
    });

    app.get("/home", function (req, res) {
        res.sendFile(path.join(__dirname + '/../public/home.html'));
    });

    app.post("/login", function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err || !user) { return res.json({"info" : info}); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                return res.redirect('/home');
            });
        })(req, res, next);
    });

    app.post("/logout", function (req, res, next) {
        // TODO
    });

    app.post("/register", function(req, res, next) {
        var answer = passportConfig.register(req);
        return res.send(201);
    });

    app.get("/mealMenus", function (req, res) {
        var date;
        if (req.query.date && req.query.date.toUpperCase() == "TODAY") {
            date = moment();
        }
        DataController.getMealMenus(req.query.restaurant, date).then(function(mealMenus) {
            res.json(mealMenus);
        });
    });

    app.get("/mealMenus/reload", function (req, res) {
        MealDaemon.reload();
        res.send(200);
    }) 

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/");
}