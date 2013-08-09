define([
  'model/notification'
], function (Notification) {
  'use strict';

  /**
    Recent collection that is extension of [Backbone.Collection](http://backbonejs.org/#Collection).

    @class Notifications
    @namespace Collection
    @extends Backbone.Collection
  */
  return Backbone.Collection.extend({
    /**
      Defines model used by collection.

      @property model 
      @type {Checkin}
      @readOnly
    */
    model: Notification
  });
});