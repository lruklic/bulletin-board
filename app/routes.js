var DataController = require('./db/data');

var User = require('./models/user');

module.exports = function (app, path, passport) {

    app.get("/tournaments", isLoggedIn, function (req, res) {
        res.json(DataController.getTournaments());
    });

    app.get("/tournament/:id", function (req, res) {
        var id = req.params.id;
        var tournament = DataController.getTournament(id);
        res.json(tournament);
    });

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
        res.json(DataController.getUsers());
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

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/");
}