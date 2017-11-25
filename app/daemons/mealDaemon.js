var DataController = require('../db/data');

var https = require('https');
var graph = require('fbgraph');
var ontime = require('ontime');
var cheerio = require('cheerio');
var request = require('request');
var moment = require('moment');

var MealMenu = require('../models/mealmenu');

module.exports = function () {

    ontime({
        cycle: '08:30:00'
    }, function (ot) {
        console.log('Fetching BTW menu for ' + new Date());
        //fetchBTW();
        ot.done();
        return;
    });

    fetchVujca();
    
};

function fetchBTW() {

    var appId = "1669092963136035";
    var appSecret = "c6a1560e72195a8364f6c0317384483f";

    graph.get("BTWrestaurant/posts?access_token=" + appId + "|" + appSecret, function(err, res) {
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

function fetchVujca() {

    request("http://jambresic.com/gableci/", function(error, response, html){        
        if(!error){
            var $ = cheerio.load(html);
        
            $("img.fl-photo-img").each(function() {
                var foodImage = $(this)[0];

                var day = foodImage.attribs.alt;
                if (dayIndex(day) >= 0) {
                    var mealMenu = new MealMenu();
                    mealMenu.date = getDayOffset(day.toUpperCase()).toDate();
                    mealMenu.restaurant = "vujca";
                    mealMenu.meals = foodImage.attribs.src;
                    
                    mealMenu.save(function(err) {
                        if (err){
                            console.log('Error in Saving mealMenu: '+err);  
                            throw err;  
                        }
                        console.log('mealMenu saved');       
                    });
                }           
            });
        }
    })
}

function dayIndex(day) {
    return ['PONEDJELJAK', 'UTORAK', 'SRIJEDA', 'CETVRTAK', 'PETAK', 'SUBOTA'].indexOf(day.toUpperCase());
}

function getDayOffset(day) {
    return moment(new Date()).add(dayIndex(day), 'days');

}