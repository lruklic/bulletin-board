var mongoose = require('mongoose');

var mealSchema = new mongoose.Schema();
mealSchema.add({
    text : String,
    price : String
});

var mealMenuSchema = mongoose.Schema({
    id : Number,
    restaurant : String,
    date : Date,
    meals : String
});

module.exports = mongoose.model('MealMenu', mealMenuSchema);