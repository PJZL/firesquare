define([
  'text!template/checkinSummary.html',
  'text!template/info.html'
], function(template, infoTemplate) {
  'use strict';

  var _drawer,
    _insights = new Backbone.Collection();

  /**
    Method shows insight details in info window.

    @method _showDetails
    @for CheckinSummary
    @param event
    @static
    @private
  */
  function _showDetails(event) {
    var insight = _insights.get(event.currentTarget.id);

    $('body').append(_.template(infoTemplate, {
      message: '<div style="text-align: center;"><img src="' + insight.get('points').image.prefix + insight.get('points').image.sizes[2] + insight.get('points').image.name + '"/></div>',
      details: insight.get('points').message,
      button1: 'Ok',
      button2: undefined
    }));

    $('button.button1').one('click', function() {
      $('body > form').remove();
    });
  }

  /**
    Method removes Login from DOM and unbinds events.

    @method _remove
    @for CheckinSummary
    @static
    @private
  */
  function _remove() {
    $('li[data-state="new"] a').off('click', _showDetails);
  }

  /**
    Method switch to `recent` view. If recent view is loaded it closes all open windows.

    @method _close
    @for CheckinSummary
    @param event
    @static
    @private
  */
  function _close(event) {
    if (event !== undefined) {
      event.preventDefault();
    }

    var nextViewHash = '#recent';

    if (window.location.hash === nextViewHash) {
      _drawer.removeAllWindow();
    } else {
      window.location.hash = nextViewHash;
    }
  }

  /**
    Method is called when Login object is initialised.

    @method _initialize
    @for CheckinSummary
    @param {Array} notifications connected with this checkin
    @param {Object} drawer
    @static
    @private
  */
  function _initialize(notifications, drawer) {
    var insights,
      message;

    _drawer = drawer;

    _drawer.setWindow('Checkin summary', _remove);
    $('section header a').last().one('click', _close);

    insights = notifications.where({type: 'insights'});

    if (insights.length > 0) {
      _insights = insights[0].getItem();
    }

    message = notifications.where({type: 'message'});
    if (message.length > 0) {
      message = message[0].getItem();
    } else {
      message = '';
    }

    $('section div[role="main"]').last().html(_.template(template, {
      insights: _insights,
      message: message.get('message')
    }));
    $('li[data-state="new"] a').on('click', _showDetails);
  }

  /**
    Checkin summary view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class CheckinSummary
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    /**
      Method points to {{#crossLink "CheckinSummary/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for CheckinSummary
    */
    initialize: _initialize,
    /**
      Method points to {{#crossLink "CheckinSummary/_remove"}}{{/crossLink}} method.

      @method remove
      @for CheckinSummary
    */
    remove: _remove
  });
});
