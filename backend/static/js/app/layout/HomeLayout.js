define([
	'app',
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'views/Home_LoginView',
	'views/Home_SignupView',
	'views/Home_ForgotPasswordView',
	'views/Home_ChangePasswordView',
	'views/Home_VerifyEmailView',
	'views/Home_AboutView',
	'text!templates/home_layout.html',
	"pagepiling"
],  function (App, $, Backbone, Marionette, _, Handlebars, LoginView, SignupView, ForgotPasswordView, ChangePasswordView, VerifyEmailView, AboutView, template) {

	"use strict";

	return Backbone.Marionette.LayoutView.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;	
			this.checkPageLoad();
		},
		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		onRender: function() {
			if(this.options.action === "signup"){
				this.signupView = new SignupView();
				this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));

				this.loginRegion.show(this.signupView);
			} else if(this.options.action === "forgotpassword"){
				this.forgotPasswordView = new ForgotPasswordView();
				this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));	

				this.loginRegion.show(this.forgotPasswordView);
			} else if(this.options.action === "changepassword") {
				if(this.options.action === "changepassword"){
					this.changePasswordView = new ChangePasswordView({
						id: this.options.id
					});
				} else {
					this.changePasswordView = new ChangePasswordView({
						id: ""
					});
				}
				this.changePasswordView.on("click:login:show", this.changePasswordtoLoginViewTriggers.bind(this));

				this.loginRegion.show(this.changePasswordView);
			} else if(this.options.action === "verifyemail"){
				if(this.options.action === "verifyemail" && this.options.id && this.options.id !== "" ){
					this.verifyEmailView = new VerifyEmailView({
						id: this.options.id
					});
				} else{
					this.verifyEmailView = new VerifyEmailView({
						id: ""
					});
				}
				this.verifyEmailView.on("click:login:show", this.verifyEmailtoLoginViewTriggers.bind(this));

				this.loginRegion.show(this.verifyEmailView);
			} else {
				this.loginView = new LoginView();
				this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
				this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));

				this.loginRegion.show(this.loginView);
			}
			this.aboutRegion.show(new AboutView());
			$("body").removeClass("f-topbar-fixed");
			$(window).scrollTop(0);
			$(window).scroll(function () {
			    $("body").animate({"background-position":"50% " + ($(this).scrollTop() / 2) + "px"},{queue:false, duration:500});
			});
		},
		onShow: function() {
			var self = this;
			$(document).foundation();
		    $('#pagepiling').pagepiling({
		    	menu: null,
		        direction: 'vertical',
		        verticalCentered: true,
		        scrollingSpeed: 700,
		        easing: 'swing',
		        css3: true
		    });		    
		},
		checkPageLoad: function(){
			var self = this;
			checkLoginSection();
			function checkLoginSection(){
				var interval = setInterval(function(){
			   		if ($('#home_loginSection').length !== 0) {
					    clearInterval(interval);
					    checkLoginImage();
					    $("#parallax-pageLoadMeter").css('width','15%');
					}
			    },100);
			}
			function checkLoginImage(){
				var interval = setInterval(function(){
					if($("#parallax-pageLoadImg").length != 0){
						clearInterval(interval);
					    checkAboutSection();
					    $("#parallax-pageLoadImg").css('opacity',0.3);
					    $("#parallax-pageLoadMeter").css('width','35%');
					}
				},100);
			}
			function checkAboutSection(){
				var interval = setInterval(function(){
			    	if ($('#home_aboutSection').length !== 0) {
					    clearInterval(interval);
					    checkScreenshotSection();
					    $("#parallax-pageLoadImg").css('opacity',0.4);
					    $("#parallax-pageLoadMeter").css('width','50%');			
					}
			    },100);
			}
			function checkScreenshotSection(){
				var interval = setInterval(function(){
			    	if ($('#home_screenshotSection').length !== 0) {
					    clearInterval(interval);
					    checkprofileScreenShotSection();
					    $("#parallax-pageLoadImg").css('opacity',0.5);
					    $("#parallax-pageLoadMeter").css('width','65%');
					}
			    },100);
			}
			function checkprofileScreenShotSection() {
				var interval = setInterval(function(){
			    	if ($('#home_profileScreenshotImg').length !== 0) {
					    clearInterval(interval);
					    checkforumsScreenShotSection();
					    $("#parallax-pageLoadImg").css('opacity',0.6);
					    $("#parallax-pageLoadMeter").css('width','75%');
					}
			    },100);
			}
			function checkforumsScreenShotSection() {
				var interval = setInterval(function(){
			    	if ($('#home_forumsScreenshotImg').length !== 0) {
					    clearInterval(interval);
					    checkFooterSection();
					    $("#parallax-pageLoadImg").css('opacity',0.7);
					    $("#parallax-pageLoadMeter").css('width','85%');
					}
			    },100);
			}
			function checkFooterSection(){
				var interval = setInterval(function(){
			    	if ($('#home_footerSection').length !== 0) {
					    clearInterval(interval);
					    $("#parallax-pageLoadMeter").css('width','100%');
					    $("#parallax-pageLoadImg").css('opacity',1);
					    // This removes the pp-tablecell element that pagepiling puts in which causes styling issues
					    self.$el.find(".pp-tableCell").each(function(){
					    	$(this).removeClass();
					    	$(this).removeAttr('style');			
						});
					    setTimeout(function() {
					    	$("#parallax-pageLoad").fadeOut();
					      	$("section").fadeIn();
						}, 1000);	    
					}
			    },100);
			}	
		},
		logintoSignupViewTriggers: function(){
	
			this.signupView = new SignupView();
			this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));
			this.loginRegion.show(this.signupView);
			Backbone.history.navigate('home/signup');

			/* When signup view is shown, the login view has been destroyed
			 * Thus, we re-instantiate login view rebind the signup show and forgot password show
			 */
			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
		},
		signuptoLoginViewTriggers: function() {

			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the signup view has been destroyed
			 * Thus, we re-instantiate signup view and rebind the login show
			 */
			this.signupView = new SignupView();
			this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));
		},
		logintoForgotPasswordViewTriggers: function() {

			this.forgotPasswordView = new ForgotPasswordView();
			this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));
			this.loginRegion.show(this.forgotPasswordView);
			Backbone.history.navigate('home/forgotpassword');

			/* When forgot password view is shown, the login view has been destroyed
			 * Thus, we re-instantiate login view and rebind the forgot password show and signup show
			 */
			this.loginView = new LoginView();
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));	
		},
		forgotPasswordtoLoginViewTriggers: function(){
			
			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the forgot password view has been destroyed
			 * Thus, we re-instantiate forgot password view and rebind the login show
			 */
			this.forgotPasswordView = new ForgotPasswordView();
			this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));
		},
		changePasswordtoLoginViewTriggers: function(){
			
			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the change password view has been destroyed
			 * Thus, we re-instantiate change password view and rebind the login show
			 */
			this.changePasswordView = new ChangePasswordView();
			this.changePasswordView.on("click:login:show", this.changePasswordtoLoginViewTriggers.bind(this));
		},
		verifyEmailtoLoginViewTriggers: function() {

			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the change verify email view has been destroyed
			 * Thus, we re-instantiate verify email view and rebind the login show
			 */
			self.verifyEmailView = new VerifyEmailView();
			self.verifyEmailView.on("click:login:show", this.verifyEmailtoLoginViewTriggers.bind(this));
		}
	});
});