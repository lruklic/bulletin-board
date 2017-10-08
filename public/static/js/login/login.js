$(function() {

    $('.modal').modal();

    $('select').material_select();

    $("#login-form").validate({
        rules: {
            email: {
                required : true
            },
            password : {
                required : true
            }
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

    $("#btn-login").on('click', function() {
        $.ajax({
            url : "/login",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify({"username" : $("#email").val(), "password" : $("#password").val()}),
            success : function(data, textStatus, jqXHR) {
                if (data.info) {
                    var obj = {};
                    obj[data.info.error] = data.info.message;
                    $("#login-form").validate().showErrors(obj);
                } else {
                    window.location.href = "/home";
                }
            },
            error : function() {
                console.log("fail")
            }

        });
    });

    $("#btn-register").on('click', function() {
        var registerModal = $("#register-modal");
        $.ajax({
            url : "/register",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify({
                "username" : registerModal.find('[name="username"]').val(), 
                "password" : registerModal.find('[name="password"]').val(),
                "company" : registerModal.find('[name="company"]').val(),
                "firstName" : registerModal.find('[name="firstName"]').val(),
                "lastName" : registerModal.find('[name="lastName"]').val()                
            }),
            success : function(data, textStatus, jqXHR) {

            },
            error : function() {

            }
        })
    });




});