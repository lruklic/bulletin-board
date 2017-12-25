function loadLatestMeals() {

    $.when($.ajax("/mealMenus?restaurant=btw"), $.ajax("/mealMenus?restaurant=vujca&date=today")).done(function(d1, d2) {
        console.log(d1);
        console.log(d2);
        $('#meals-section [data-place="btw"] .text').html(d1[0][0].meals.replace(/\n/g, "<br />"));
        $('#meals-section [data-place="vujca"] img').attr("src", d2[0][0].meals);        
        console.log(d1[0]);
    });
    
}