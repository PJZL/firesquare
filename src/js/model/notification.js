define([
], function () {
  'use strict';

  /**
    Method get multi elsments Foursquare object and returns [Backbone.Collection](http://backbonejs.org/#Collection).

    @method _returnCollection
    @for Notification
    @param {Array} collection
    @static
    @private
  */
  function _returnCollection(collection) {
    if (collection.count > 0) {
      return new Backbone.Collection(collection.items);
    }
    return new Backbone.Collection();
  }

  /**
    Method determines type of noticication and returns [Backbone.Model](http://backbonejs.org/#Model)
    or [Backbone.Collection](http://backbonejs.org/#Collection), containing notification data.

    @method _getItem
    @for Notification
    @param {Model.Notification} notification
    @static
    @private
  */
  function _getItem(notification) {
    var type = notification.get('type');

    switch (type) {
    case 'message':
      return new Backbone.Model(notification.get('item'));
    case 'insights':
      return _returnCollection(notification.get('item')[type]);
    }
  }

  /**
    Checkin model that is extension of [Backbone.Model](http://backbonejs.org/#Model).

    @class Notification
    @namespace Model
    @extends Backbone.Model
  */
  return Backbone.Model.extend({
    /**
      Method runs {{#crossLink "Notification/_getItem"}}{{/crossLink}} method that returns notification data.

      @method getItem
      @for Notification
    */
    getItem: function () {
      return _getItem(this);
    }
  });

});
