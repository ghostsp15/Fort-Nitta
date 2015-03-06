define([
    'jquery',
    'marionette',
    'backbone',
    'underscore'
], function($, Marionette, Backbone, _) {
    'use strict';
    
    return Backbone.Model.extend({
        initialize: function(){
            _.bindAll(this);
        },

        defaults: {
            id: -1,
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            date_joined: '',
            admin_access: false
        }
    });
});