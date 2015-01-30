define([
    'App',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/home_forgotPasswordBox.html'
], function (App, $, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
           "click #backLoginButton": "loginShow",
           "click #passwordRecButton": "passwordRecovery"
        },
        loginShow: function() {
            this.trigger("click:login:show");
        },
        passwordRecovery: function(event) {
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }  
            var email = $("#emailInput").val();
            if(email === ""){
                $("#emailError").addClass("show");
                setTimeout(function() {
                    $("#emailError").removeClass("show");
                }, 5000);
            } else{
                console.log(email);
                $.ajax({
                    url: '/api/mail/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'email': email}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        console.log(data);
                        if(data.success){
                            $("#emailSuccess").addClass("show");
                            setTimeout(function() {
                                $("#emailSuccess").removeClass("show");
                            }, 5000);
                        } else {
                            $("#emailError").addClass("show");
                            setTimeout(function() {
                                $("#emailError").removeClass("show");
                            }, 5000);
                        }
                    },
                    error: function(){
                        $("#emailError").addClass("show");
                        setTimeout(function() {
                            $("#emailError").removeClass("show");
                        }, 5000);
                    }
                });
            } 
        }
    });
});