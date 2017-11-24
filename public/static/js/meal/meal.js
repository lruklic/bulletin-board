function loadLatestMeals() {
    $.when($.ajax("/mealMenus?restaurant=btw")).done(function(d1) {
        $('#meals-section [data-place="btw"]').html(d1[0].meals.replace(/\n/g, "<br />"));
        console.log(d1[0]);
    });
    
}