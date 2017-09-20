var express = require('express');
var http = require('http');
var path = require('path');  
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.listen(3000, function () {
    console.log('Server started on port 3000 ...');
});