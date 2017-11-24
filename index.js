var express = require('express');
var passport = require("passport");
var http = require('http');
var path = require('path');  
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 3000;

// Initialize passport
var passportConfig = require("./config/passport");
passportConfig.initialize(passport);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Initialize session
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Enable REST routes
require("./app/routes.js")(app, path, passport);

// Start daemons
require("./app/daemons/tournamentDaemon.js")();
require("./app/daemons/mealDaemon.js")();

var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url);

app.listen(3000, function () {
    console.log('Server started on port 3000 ...');
});