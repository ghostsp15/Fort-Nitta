/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_announcements.html',
    //'collections/AnnouncementsCollection',
    'moment'
], function (App, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
    template: Handlebars.compile(template),
    //collection: new LeaderboardsCollection(),

        initialize: function(options){
            this.options = options;

            // Reset collection because it is saved when using the "back" button which causes bugs
            //this.collection.reset();

          
        },
        events: {
          
        },
        onRender: function(){

        },
        onShow: function() {
            
        },
        onBeforeDestroy: function(){
            this.unbind();
        },
    });
});