define([
	'app',
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'models/SessionModel',
	'text!templates/main_layout.html',
	'views/Main_TopBarView',
	'views/Main_PlayersView',
	'views/Main_ProfileView',
	'layout/Main_SettingsLayout',
	'layout/Main_MessagesLayout',
	'layout/Main_ForumsLayout',
	'cookie',
	'foundation',
	'foundation-topbar',
	'foundation-datatables'
],  function (App, $, Backbone, Marionette, _, Handlebars, SessionModel, template, TopBarView, PlayersView, MyProfileView, SettingsLayout, MessagesLayout, ForumsLayout) {

	"use strict";

	return Backbone.Marionette.LayoutView.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
			this.topbarView = new TopBarView();
			this.playersView = new PlayersView();
			var self = this;

			this.playersView.on("click:playersDisplay:show", function(){
				$("#contentArea").removeClass("contentShow").addClass("contentHide");
				$("#playersRegion").removeClass("playersHide").addClass("playersShow");
			});
			this.playersView.on("click:playersDisplay:hide", function(){
				$("#contentArea").removeClass("contentHide").addClass("contentShow");
				$("#playersRegion").removeClass("playersShow").addClass("playersHide");
			});
			this.topbarView.on("click:settings:show", function(){
				self.contentRegion.show(new SettingsLayout());
				Backbone.history.navigate('main/settings');
			});
			this.topbarView.on("click:myprofile:show", function(){
				self.contentRegion.show(new MyProfileView());
				Backbone.history.navigate('main/myprofile');
			});
			this.topbarView.on("click:messages:show", function(){
				self.contentRegion.show(new MessagesLayout());
				Backbone.history.navigate('main/messages');
			});
			this.topbarView.on("click:forums:show", function(){
				self.contentRegion.show(new ForumsLayout());
				Backbone.history.navigate('main/forums');
			});
		},
		regions: {
			topbarRegion: "#topbarRegion",
			playersRegion: "#playersRegion",
			contentRegion: "#contentRegion"
		},
		onRender: function() {
			var self = this;
			this.topbarRegion.show(this.topbarView);
			this.playersRegion.show(this.playersView);
			
			if(this.options.action === "settings"){
				this.contentRegion.show(new SettingsLayout());
			} else if(this.options.action === "messages"){
				this.contentRegion.show(new MessagesLayout());
			} else if(this.options.action === "forums"){
				this.contentRegion.show(new ForumsLayout({
					action: self.options.action2
				}));
			} else{
				this.contentRegion.show(new MyProfileView());
			}
		},
		onShow: function() {
			$(document).foundation();
		}
	});
});