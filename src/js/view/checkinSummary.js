define([
  'text!template/checkinSummary.html',
  'view/drawer',
], function(template, Drawer) {
  'use strict';

  var _drawer;

  function _initialize(notifications) {
    var i,
      notif = {};

    _drawer = new Drawer();
    _drawer.setWindow('Checkin summary');

    $('section header a').last().on('click', _remove);

    

    for (i = 0; i < notifications.length; i+=1) {
      if (notifications[i].type === 'message' ||
          notifications[i].type === 'insights') {
        notif[notifications[i].type] = notifications[i];
      }
    }

    console.log(notif);

    $('section div[role="main"]').last().html(_.template(template, notif));
  }

  function _remove() {
    _drawer.removeWindow();
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});