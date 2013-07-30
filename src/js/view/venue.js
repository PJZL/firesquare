define([
  'text!template/venue.html',
  'text!template/spinner.html',
  'text!template/info.html',
  'view/checkinSummary'
], function (template, spinnerTemplate, infoTemplate, CheckinSummary) {
  'use strict';

  var _venue,
    _drawer,
    _fetch,
    _checkinPromise,
    _checkin;

  /**
    Method updates venue view when new data is loaded.

    @method _refresh
    @for Venue
    @static
    @private
  */
  function _refresh() {
    $('body[role="application"] section[role="region"] > header h1').last().html(_venue.get('name'));
    $('section div[role="main"]').last().html(_.template(template, _venue));
    $('button.recommend').on('click', _checkin);
  }

  /**
    Method removes Venue from DOM and unbinds events.

    @method _remove
    @for Venue
    @param {Object} event
    @static
    @private
  */
  function _remove() {
    $('section header a').last().off('click', _remove);
    $('button.recommend').off('click', _checkin);
    if (_fetch !== undefined &&
        typeof (_fetch.abort) === 'function') {
      _fetch.abort();
    }
    if (_checkinPromise !== undefined &&
        typeof (_checkinPromise.abort) === 'function') {
      _checkinPromise.abort();
    }
  }

  /**
    Method is called when Venue object is initialised.

    @method _initialize
    @for Venue
    @param {Object} venue object.
    @param {Object} drawer object.
    @static
    @private
  */
  function _initialize(venue, drawer) {
    _venue = venue;
    _drawer = drawer;
    _drawer.setWindow(_venue.get('name'), _remove);

    _venue.on('change', _refresh);
    _fetch = _venue.fetch();

    $('section header a').last().on('click', _drawer.removeWindow);
  }

  /**
    Method is called when user click's on checkin button.

    @method _checkin
    @for Venue
    @static
    @private
  */
  _checkin = function() {

    function _error(data) {
      $('body > form').remove();
      $('body').append(_.template(infoTemplate, {
        message: 'Checkin in failed!',
        details: data.statusText,
        button1: 'Cancel',
        button2: 'Retry'
      }));
      $('button.button1').on('click', function() {
        $('body > form').remove();
      });
      $('button.button2').on('click', _checkin);
    }

    function _success(data) {
      $('body > form').remove();

      if (typeof data === 'string') {
        //on Firefox OS data is string type
        data = JSON.parse(data);
      }

      return new CheckinSummary(data.notifications, _drawer);
    }

    function _abort() {
      _checkinPromise.abort();
      $('body > form').remove();
    }

    if (_checkinPromise !== undefined &&
        typeof (_checkinPromise.abort) === 'function') {
      _checkinPromise.abort();
    }

    $('body').append(_.template(spinnerTemplate, {
      message: 'Checking in ...',
      button1: 'Cancel',
      button2: undefined
    }));
    _checkinPromise = _venue.checkin(_success, _error);
    $('button.button1').on('click', _abort);

    //_success({});
  };

  /**
    Venue view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class Venue
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    /**
      Method is called when new SearchVenue object is created. It points to {{#crossLink "SearchVenue/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for SearchVenue
      @constructor
    */
    initialize: _initialize,
    /**
      Method points to {{#crossLink "SearchVenue/_remove"}}{{/crossLink}} method.

      @method remove
      @for SearchVenue
    */
    remove:     _remove
  });
});