define([
], function () {
  'use strict';

  function _returnModel(item) {
    return new Backbone.Model(item[item.type]);
  }

  function _returnCollection(item) {
    return new Backbone.Collection(item[item.type].items);
  }

  function _getItem(notification) {
    var item = notification.get('item');

    switch (item.type) {
      case 'message':
        return _returnModel(item);
      case 'insights':
        return _returnCollection(item);
    }
  }

  /**
    Checkin model that is extension of [Backbone.Model](http://backbonejs.org/#Model).

    @class Notification
    @namespace Model
    @extends Backbone.Model
  */
  return Backbone.Model.extend({
    getItem: function () {
      //return _getItem(this);
      console.log(this);
    }
  });

});
