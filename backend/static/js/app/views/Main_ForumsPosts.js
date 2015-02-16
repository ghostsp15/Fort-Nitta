define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_forumsposts.html'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
           
        },
        onRender: function() {
            this.$el.find("#forumsPosts-header").text(this.options.id);
            this.$el.find("#postsTable").DataTable({
                "aDataSort": false,
                "aaSorting": [],
                "bSort": false
            });
        },

        
    });
});