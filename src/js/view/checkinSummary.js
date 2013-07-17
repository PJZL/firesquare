define([
  'text!template/checkinSummary.html'
], function(template) {
  'use strict';

  var _drawer;

  function _initialize(notifications, drawer) {
    var i,
      notif = {};

    _drawer = drawer;
    _drawer.setWindow('Checkin summary');

    $('section header a').last().on('click', _remove);

    for (i = 0; i < notifications.length; i+=1) {
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

  function _remove(event) {
    event.preventDefault();
    _drawer.removeWindow();
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});