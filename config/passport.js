var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var DataController = require('../app/db/data');

var User = require('../app/models/user');
var crypt = require('../app/crypt/crypt.js');

module.exports = {
    initialize : function(passport) {
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

    },
    register : function(req) {
        var newUser = new User();
        
        // set the user's local credentials
        newUser.username = req.param('username');
        newUser.password = crypt.createHash(req.param('password'));
        newUser.company = req.param('company');
        newUser.firstName = req.param('firstName');
        newUser.lastName = req.param('lastName');
    
        // save the user
        newUser.save(function(err) {
            if (err){
            console.log('Error in Saving user: '+err);  
            throw err;  
            }
            console.log('User Registration succesful');    
            return {"success" : true};
        });

        return null;
    }
}

var authStrategy = function (username, password, done) {  

    DataController.getUserByUsername(username).then(function(user) {
        console.log(user);
        if (!user) {
            done(null, false, { error : "email", message: "User doesn't exist " });
        } else if (crypt.isValidPassword(user, password)) {
            done(null, {"id" : user._id});
        } else {
            done(null, false, { error : "password", message: 'Incorrect password ' });
        }
    });
};
