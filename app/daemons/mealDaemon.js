var DataController = require('../db/data');

var https = require('https');
var graph = require('fbgraph');
//var moment = require('node-moment');

var MealMenu = require('../models/mealmenu');

module.exports = function () {

    //fetchBTW();

};

function fetchBTW() {

    var appId = ""; // enter app ID
    var appSecret = ""; // enter app secret



    graph.get("BTWrestaurant/posts?access_token=" + appId + "|" + appSecret, function(err, res) {
        console.log(res); 
        var mealMenu = new MealMenu();
        mealMenu.date = new Date(res.data[0].created_time);
        mealMenu.restaurant = "btw";
        mealMenu.meals = res.data[0].message;
    
        mealMenu.save(function(err) {
            if (err){
                console.log('Error in Saving mealMenu: '+err);  
                throw err;  
            }
            console.log('mealMenu saved');       
        });
    });
}