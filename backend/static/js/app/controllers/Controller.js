define([
    'App', 
    'backbone', 
    'marionette', 
    'models/SessionModel',
    'layout/HomeLayout',
    'layout/MainLayout',
    'cookie'
], function (App, Backbone, Marionette, SessionModel, HomeLayout, MainLayout) {
    'use strict';


    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            // Create a new session model and scope it to the app global
            // This will be a singleton, which other modules can access
            App.session = new SessionModel({});

            App.session.on("change:logged_out", function(){
                Backbone.history.navigate('home', {trigger: true});
            });
            App.session.on("change:logged_in", function(){
                Backbone.history.navigate(Backbone.history.fragment, false);
            });
        },
        //gets mapped to in AppRouter's appRoutes
        index:function (action, id) {
            // Check the auth status upon initialization,
            // if logged in, redirect to main page
            App.session.checkAuth(function(loginStatus){
                if(loginStatus){
                    if(App.session.user.get('new_user') === 0){

                        console.log("1");

                        if(action && action !== 'undefined' && id === 'undefined' && !id){
                            Backbone.history.navigate('main/'+String(action), {trigger: true});
                        } else if(action && action !== 'undefined' && id !== 'undefined' && id) {
                            Backbone.history.navigate('main/'+String(action)+"/"+String(id), {trigger: true});
                        } else {
                            Backbone.history.navigate('main', {trigger: true});
                        }
                    } else {    

                        console.log("2");

                        App.session.logout({
                        },{
                            success: function(){
                                console.log("Logged out"); 
                                App.mainRegion.show(new HomeLayout({
                                    action: "verifyemail",
                                    id: String(id).toLowerCase()
                                }));   
                                Backbone.history.navigate('home/verifyemail');
                            },
                            error: function(xhr, textStatus, errorThrown ) {
                                if (textStatus == 'timeout') {
                                    this.tryCount++;
                                    if (this.tryCount <= this.retryLimit) {
                                        //try again
                                        $.ajax(this);
                                        return;
                                    }            
                                    return;
                                }
                            }
                        });
                    }  
                } else {
                    App.mainRegion.show(new HomeLayout({
                        action: String(action).toLowerCase(),
                        id: String(id).toLowerCase()
                    }));
                }
            });          
        },
        main:function (action, id) {
            // Check the auth status upon initialization,
            // if logged in, continue to main page
            App.session.checkAuth(function(loginStatus){
                
                if(loginStatus){
                    if(App.session.user.get('new_user') === 0){

                        console.log("3", action, id);

                        App.mainRegion.show(new MainLayout({
                            action: String(action).toLowerCase(),
                            id: String(id).toLowerCase()
                        }));
                    } else {

                        console.log("4");

                        App.session.logout({
                        },{
                            success: function(){
                                console.log("Logged out");     
                                App.mainRegion.show(new HomeLayout({
                                    action: "verifyemail",
                                    id: String(id).toLowerCase()
                                }));          
                                Backbone.history.navigate('home/verifyemail');
                            },
                            error: function(xhr, textStatus, errorThrown ) {
                                 if (textStatus == 'timeout') {
                                    this.tryCount++;
                                    if (this.tryCount <= this.retryLimit) {
                                        //try again
                                        $.ajax(this);
                                        return;
                                    }            
                                    return;
                                }
                            }
                        });
                    }   
                } else {

                    console.log("5");

                    if(action && action !== 'undefined' && id === 'undefined' && !id){
                        this.navigate('home/'+String(action), {trigger: true});
                    } else if(action && action !== 'undefined' && id !== 'undefined' && id) {
                        this.navigate('home/'+String(action)+"/"+String(id), {trigger: true});
                    } else {
                        this.navigate('home', {trigger: true});
                    }
                }
            });
                
        }

    });
});