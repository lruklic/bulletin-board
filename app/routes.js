var DataController = require('./db/data');

var User = require('./models/user');

module.exports = function(app, path, passport) {

    app.get("/tournaments", isLoggedIn, function(req, res) {
        res.json(DataController.getTournaments()); 
     });
     
    app.get("/tournament/:id", function(req, res) {
        var id = req.params.id;
        var tournament = DataController.getTournament(id);
        res.json(tournament);
    });
    
    app.get("/profile", function(req, res) {
        var user = req.user;
        if (user) {
            var user = DataController.getUserByUsername(user.username).then(function(user) { 
                res.json(user);
            }); 
        } else {
            res.json({});
        }
    });

    app.get("/users", isLoggedIn, function(req, res) {
        res.json(DataController.getUsers());
    });
    
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname + '/../public/login.html'));
    });

    app.get("/home", function(req, res) {
        res.sendFile(path.join(__dirname + '/../public/home.html'));
    });

    app.post("/login", passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/"); 
}