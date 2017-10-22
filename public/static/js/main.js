var state = {"tournaments" : {}, "players" : {}, "profile" : {}};

$(function() {

    loadData();

    $(".show-menu").sideNav();

    $('ul.tabs').tabs({ "swipeable" : true });

    $(".register-btn").on('click', function() {
        var tournamentId = $(this).attr("data-tournament-id");
        if ($(this).hasClass("register")) {
            action = "REGISTER";
        } else {
            action = "UNREGISTER";
        }
        $.ajax({
            url : "/tournaments/register",
            type : "PUT",
            data : JSON.stringify(
                {"tournamentId" : tournamentId, "action" : action}
            ),
            contentType : "application/json",
            success : function(res) {
                loadData();
            }
        })
    });

});

function loadData() {
    $.when($.ajax("/tournaments"), $.ajax("/users"), $.ajax("/profile")).done(function(d1, d2, d3) {

        if ($.isEmptyObject(d3[0])) {
            window.location.replace("/")
        }

        console.log("reload data");
        console.log(d1[0]);
        console.log(d2[0]);
        console.log(d3[0]);        

        state.tournaments = d1[0];
        state.users = d2[0];
        state.profile = d3[0];

        var tourId = 0;

        for (var hash in state.tournaments) {
            var tournament = state.tournaments[hash];
            if (tournament.status.phase == "REGISTRATION") {

                var playersTableData = [];

                registrationCountdownTimer(tourId, tournament.status.until);
                var registeredUsers = tournament.registeredUsers;

                var span = $("#register-" + tourId + " .register-players");
                span.empty();

                for (var i = 0; i < registeredUsers.length; i++) {
                    var user = state.users.find((user) => { return user.uuid == registeredUsers[i]; });
                    var fullname = user.firstName + " " + user.lastName;
                    appendToRegisterList(span, fullname, user.company);
                    playersTableData.push([i, fullname, 0, 0, 0, "0:0", 0]);
                }
            }

            if ( !$.fn.DataTable.isDataTable('#tabletennis-datatable') ) {
                $('#tabletennis-datatable').DataTable( {
                    data: playersTableData,
                    columnDefs: [
                        {
                            targets: [ 0, 1, 2 ],
                            className: 'mdl-data-table__cell--non-numeric'
                        }
                    ]
                } );
            } else {
                $('#tabletennis-datatable').DataTable().clear().rows.add(playersTableData).draw();
            }

        }

        $("#slide-out .name").text(state.profile.fullname);
        $("#slide-out .email").text(state.profile.email);        

        if (state.tournaments[0].registeredUsers.indexOf(state.profile.uuid) != -1) {
            $("a.register-btn").addClass("red unregister").removeClass("register").text("Želim se odjaviti iz stolnoteniske lige");
        } else {
            $("a.register-btn").addClass("register").removeClass("red unregister").text("Da, želim se prijaviti u stolnotenisku ligu!");            
        }

    });
}

function appendToRegisterList(span, fullname, company) {
    if (span.text().length == 0) {
        span.append(fullname + " (" + company + ")");        
    } else {
        span.append(", " + fullname + " (" + company + ")");
    }
}

function registrationCountdownTimer(id, until) {
    var countDownDate = new Date(until).getTime();
    
    var x = setInterval(function() {

      var now = new Date().getTime();
      var distance = countDownDate - now;
    
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      // Display the result in the element with id="demo"
      $("#register-" + id + " .register-time-left").html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
    
      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        $("#register-" + id + " .register-time-left").html("Vrijeme prijave je završeno");
      }
    }, 1000);
};