/* RequireJS Module Dependency Definitions */
define([
	'app',
	'jquery',
	'marionette',
	'handlebars',
    'models/LoginModel',
	'text!templates/home_loginBox.html'
], function (App, $, Marionette, Handlebars, LoginModel, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),
        model: new LoginModel(),

		initialize: function(options){
			this.options = options;
            var self = this;

            Backbone.Validation.bind(this, {
              model: this.model
            });
            this.model.bind('validated:valid', function(model) {
                App.session.login({
                    data: model.toJSON()
                }, {
                    success: function(mod, res){
                        console.log("SUCCESS");
                        self.model.clear();
                        Backbone.history.navigate('main', {trigger: true});
                    },
                    error: function(err){
                        console.log("ERROR", err);
                    }
                });
            });
            this.model.bind('validated:invalid', function(model, errors) {
                Object.keys(errors).forEach(function(k) {
                    var htmlElement = self.$el.find("input[name='"+k+"']");
                    var placeholder = htmlElement.attr("placeholder");

                    htmlElement.val("");
                    htmlElement.addClass("error").attr("placeholder",errors[k]);
                    setTimeout(function() {
                        htmlElement.removeClass("error").attr("placeholder",placeholder);
                    }, 5000);
                });
            });
		},
		events: {
			"click #signupButton": "signUpShow",
			"click #loginButton": "login",
            "click #forgotPasswordA": "forgotPassword",
            "keyup #passwordInput": "onPasswordKeyup"
		},
		signUpShow: function(){
			this.trigger("click:signup:show");
		},
        // Takes care of the enter key in submitting input fields for login
        onPasswordKeyup: function(event){
            var k = event.keyCode || event.which;

            if (k == 13 && $("#passwordInput").val() === ""){
                event.preventDefault();    // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.login();
                return false;
            }
        },
		login:function (event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }   
            this.model.set({
                'username': this.$("#usernameInput").val(),
                'password': this.$("#passwordInput").val()
            }).validate();
	    },
        forgotPassword: function() {
            this.trigger("click:forgotPassword:show");
        }
	});
});