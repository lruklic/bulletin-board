$(function() {
    $("#btn-login").on('click', function() {
        $.ajax({
            url : "/login",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify({"username" : $("#email").val(), "password" : $("#password").val()}),
            success : function(data, textStatus, jqXHR) {
                window.location.href = "/home";
            },
            error : function() {
                console.log("fail")
            }

        });
    });
});