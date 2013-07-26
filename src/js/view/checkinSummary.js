define([
  'text!template/checkinSummary.html'
], function(template) {
  'use strict';

  var _drawer;

  /**
    method removes Login from DOM and unbinds events.

    @method _remove
    @for CheckinSummary
    @static
    @private
  */
  function _remove(event) {
    event.preventDefault();
    _drawer.removeAllWindow();
  }

  /**
    method is called when Login object is initialised.

    @method _initialize
    @for CheckinSummary
    @static
    @private
  */
  function _initialize(notifications, drawer) {
    var i,
      notif = {};

    _drawer = drawer;
    _drawer.setWindow('Checkin summary');

    $('section header a').last().on('click', _remove);

    for (i = 0; i < notifications.length; i += 1) {
      if (notifications[i].type === 'message' ||
          notifications[i].type === 'insights') {
        notif[notifications[i].type] = notifications[i];
      }
    }

    if (notif.insights === undefined) {
      notif.insights = undefined;
    }

    $('section div[role="main"]').last().html(_.template(template, notif));
  }

  /**
    Checkin summary view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class CheckinSummary
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});
