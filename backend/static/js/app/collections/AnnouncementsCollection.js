define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/AnnouncementsModel'
], function($, Marionette, Backbone, _, AnnouncementsModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: AnnouncementsModel,

    });
});