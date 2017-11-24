var state = {"tournaments" : {}, "players" : {}, "profile" : {}};

$(function() {

    loadData();

    $(".show-menu").sideNav();

    $('ul.tabs').tabs({ "swipeable" : true });

    $(".menu-button").on('click', function() {
        var section = $(this).attr("section");
        $(".section").addClass("hidden");
        $("#" + section +  "-section").removeClass("hidden");
    });

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

    $("#tabletennis-matches").on('click', ".edit-result-btn", function() {
        var matchId = $(this).attr("match-id");
        $('.input-field[match-id="'+matchId + '"').removeClass("hidden");
        $(this).addClass("hidden");
        $('.submit-result-btn[match-id="'+matchId + '"], .cancel-result-btn[match-id="'+matchId + '"]').removeClass("hidden");        
    });

    $("#tabletennis-matches").on('click', ".cancel-result-btn", function() {
        var matchId = $(this).attr("match-id");
        $(this).addClass("hidden");
        $('.input-field[match-id="'+matchId + '"], .submit-result-btn[match-id="'+matchId + '"]').addClass("hidden");
        $('.edit-result-btn[match-id="'+matchId + '"').removeClass("hidden");
    });

    $("#tabletennis-matches").on('click', ".submit-result-btn", function() {
        var matchId = $(this).attr("match-id");
        var result = $('.input-field[match-id="' + matchId + '"] input').val();

        var resultSplit = result.split(":");
        if (!isNaN(resultSplit[0]) && Number(resultSplit[0]) < 5 && Number(resultSplit[0]) > -1 && 
            !isNaN(resultSplit[1]) && Number(resultSplit[1]) < 5 && Number(resultSplit[1]) > -1 ) {
                $.ajax({
                    url : "/tournaments/results/upload",
                    type : "PUT",
                    data : JSON.stringify({"tournamentId" : 0, "matchId" : matchId, "result" : result}),
                    contentType : "application/json",
                    success : function(res) {
                        loadData();
                    }
                });
        } else {
            // input wrong, retry
        }


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

        loadLatestMeals();

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
                    appendToRegisterList(span, user.firstName + " " + user.lastName, user.company);
                    playersTableData.push(createPlayerTableData(i, user, tournament));
                }

                var matchesContainer = $("#tabletennis-matches");
                matchesContainer.empty();
                var dayCount = 1;
                for (var i = 0; i < tournament.matches.length; i++) {
                    if (i % (registeredUsers.length / 2) == 0) {
                        matchesContainer.append("<h3> Dan " + dayCount + "</h3>")
                        dayCount++;
                    } 
                    matchesContainer.append(matchDiv(tournament.matches[i]));
                }
            }

            jQuery.fn.dataTableExt.oSort['score-asc']  = function(a,b) {
                
                return ((x < y) ? -1 : ((x > y) ?  1 : 0));
            };
            
            jQuery.fn.dataTableExt.oSort['score-desc'] = function(a,b) {
                var aScore = a.split(":");
                var bScore = b.split(":");

                var aDiff = Number(aScore[0]) - Number(aScore[1]);
                var bDiff = Number(bScore[0]) - Number(bScore[1]);
                
                if (aDiff == bDiff) {
                    return (Number(aScore[0]) < Number(bScore[0])) ? 1 : 0;
                } else {
                    return (aDiff < bDiff) ? 1 : 0;
                }
            };

            if ( !$.fn.DataTable.isDataTable('#tabletennis-datatable') ) {
                $('#tabletennis-datatable').DataTable( {
                    order: [[5, "desc"], [4, "desc"]],
                    aoColumns: [
                        null,
                        null,
                        null,
                        null,
                        { "sType": "score" },
                        null
                    ],
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

        var uuid = state.profile.uuid;


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

function matchDiv(match) {
    var player1Name = getUserById(match.player1).lastName;
    var player2Name = getUserById(match.player2).lastName;

    var result;
    if (match.result) {
        result = match.result.score;
    } else {
        result = "";
    }
     
    var content = player1Name + " : " + player2Name + "  " + result;

    if (state.profile.uuid == match.player1 || state.profile.uuid == match.player2) {
        // There is a result
        if (result && result.length > 0) {
            // Current player did NOT submit the result
            if (match.result.submittedBy != state.profile.uuid) {
                content += createveButton(match.id) + createRejectButton(match.id);
            }
        // No result yet
        } else {
            content += createInlineInput(match.id);
            content += createEditButton(match.id) + createSubmitButton(match.id) + createCancelButton(match.id);
        }
    }

    return '<div class="match-text">' + content + '</div>';
}

function createPlayerTableData(index, user, tournament) {

    var matchesPlayed = 0, win = 0, loss = 0, gemsWon = 0, gemsLost = 0;
    for (var i = 0; i < tournament.matches.length; i++) {
        var match = tournament.matches[i];

        if (match.result && (match.player1 == user.uuid || match.player2 == user.uuid)) {
            matchesPlayed++;
            var scoreArray = match.result.score.split(":");
            var player1gems = Number(scoreArray[0]);
            var player2gems = Number(scoreArray[1]);

            // Player is player 1
            if (match.player1 == user.uuid) {
                if (player1gems > player2gems) {
                    win++;
                } else {
                    loss++;
                }
                gemsWon += player1gems;
                gemsLost += player2gems;
            // Player is player 2
            } else {
                if (player1gems > player2gems) {
                    loss++;
                } else {
                    win++;
                }
                gemsWon += player2gems;
                gemsLost += player1gems;
            }
        }
    }

    return [user.firstName + " " + user.lastName, matchesPlayed, win, loss, gemsWon + ":" + gemsLost, win*2 + loss*1];
}

function createveButton(index) {
    return '<a class="ve-result-btn btn-floating waves-effect waves-light green" match-id=' + index + '><i class="material-icons">done_all</i></a>';
}

function createRejectButton(index) {
    return '<a class="reject-result-btn btn-floating waves-effect waves-light red" match-id=' + index + '><i class="material-icons">remove</i></a>';
}

function createEditButton(index) {
    return '<a class="edit-result-btn btn-floating waves-effect waves-light red" match-id=' + index + '><i class="material-icons">mode_edit</i></a>';
}

function createSubmitButton(index) {
    return '<a class="hidden submit-result-btn btn-floating waves-effect waves-light green" match-id=' + index + '><i class="material-icons">check</i></a>';        
}

function createCancelButton(index) {
    return '<a class="hidden cancel-result-btn btn-floating waves-effect waves-light red" match-id=' + index + '><i class="material-icons">close</i></a>';    
}

function createInlineInput(index) {
    return '<div class="input-field inline hidden" match-id=' + index + '><input type="text" class="validate">' +
        '<label for="text" data-error="wrong" data-success="right">Result</label></div>';
}

function createFab() {
    return '<div class="fixed-action-btn horizontal">' +
    '<a class="btn-floating btn-large red"><i class="large material-icons">mode_edit</i></a>' +
    '<ul>' + 
      '<li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>' +
      '<li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>' +
      '<li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>' +
      '<li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>' +
    '</ul>' +
    '</div>';
}
