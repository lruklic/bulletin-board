var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var DataController = require('../app/db/data');

var User = require('../app/models/user');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
/*         var user = userDB[id];
        done(null, {"username" : user.username}); */
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy(authStrategy));
}

var authStrategy = function (username, password, done) {  

    DataController.getUserByUsername(username).then(function(user) {
        console.log(user);
        if (!user) {
            done(null, false, { error : "email", message: "User doesn't exist " });
        } else if (user.password == password) {
            done(null, {"id" : user._id});
        } else {
            done(null, false, { error : "password", message: 'Incorrect password ' });
        }
    });

/*     var userHash;
    for (hash in userDB) {
        if (userDB[hash] && userDB[hash].username == username) {
            userHash = hash;
            break;
        }
    }

    if (!userHash) {
        done(null, false, { message: "User doesn't exist " });
    } else if (userDB[userHash].password == password) {        
        done(null, {"id" : userHash});
    } else {
        done(null, false, { message: 'Incorrect username or password ' });
    } */
};