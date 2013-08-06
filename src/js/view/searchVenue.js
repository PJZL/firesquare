define([
  'text!template/searchVenue.html',
  'text!template/searchVenueItem.html',
  'model/service',
  'model/venue',
  'model/self',
  'view/venue',
  'view/drawer'
], function(template, itemTemplate, service, VenueModel, Self, VenueView, Drawer) {
  'use strict';

  var _drawer,
    _position,
    _search,
    _positionWatch,
    _isGPS = false;

  /**
    Method opens venue after user click.

    @method _itemClick
    @for SearchVenue
    @static
    @private
  */
  function _itemClick(element) {
    element.preventDefault();

    return new VenueView(
      new VenueModel(
        {id: $(element.currentTarget).attr('id')}
      ),
      _drawer
    );
  }

  /**
    Method updates current user position from freegeoip.net.

    @method _updateSearch
    @for SearchVenue
    @static
    @private
  */
  function _updateSearch() {

    function _callback(data) {
      $('ul.venues').empty();
      var _data;
      if (typeof data === 'string') {
        _data = JSON.parse(data);
      } else {
        _data = data;
      }
      $(_data.response.groups[0].items).each(function() {
        $('ul.venues').append(_.template(itemTemplate, this));
      });
      $('ul.venues > li').on('click', _itemClick);
    }

    if (_position !== undefined &&
        $('input').val() !== '') {
      $('ul.venues > li').off('click', _itemClick);
      $('ul.venues').html('<progress class="centre top"></progress>');
      if (_search !== undefined) {
        _search.abort();
      }
      _search = $.get(
        'https://api.foursquare.com/v2/venues/search?ll=' + _position.latitude + ',' + _position.longitude + '&oauth_token=' + service.foursquare.get('access_token') + '&query=' + $('input').val(),
        _callback
      );
    }
  }

  /**
    Method updates current user position from freegeoip.net.

    @method _getPositionFallback
    @for SearchVenue
    @static
    @private
  */
  function _getPositionFallback() {

    function _callback(data) {
      var dataJson;

      if (typeof data === 'string') {
        dataJson = JSON.parse(data);
      } else {
        dataJson = data;
      }

      //Position could have already been updated from GPS.
      if (_position === undefined) {
        _position = dataJson;
        _updateSearch();
      } else if (_isGPS === false &&
          _position.country !== undefined &&
          _position.country !== dataJson.country_name &&
          dataJson.country_name !== undefined) {
        //GPS is not ready yet, and user is in another country. The best we can do.
        _position = dataJson;
      }
    }

    $.get(
      'http://freegeoip.net/json/',
      _callback
    );
  }

  /**
    Method updates current user position from last checkin if avaliable. If last checkin is not avaliable {{#crossLink "SearchVenue/_getPositionFallback"}}{{/crossLink}} is called.

    @method _getPosition
    @for SearchVenue
    @static
    @private
  */
  function _getPosition() {
    var venue;
    //Check if we have GPS position.
    if (_position === undefined) {
      if (Self.get('checkins').items.length > 0) {
        venue = Self.get('checkins').items[0].venue;
        _position = {
          latitude: venue.location.lat,
          longitude: venue.location.lng
        };
      }
      //Always get fallback - in at least country will be right.
      _getPositionFallback();
    }
  }

  /**
    Method updates current user position when window.navigator.goolocation is avaliable.

    @method _getGPSPosition
    @for SearchVenue
    @static
    @private
  */
  function _getGPSPosition() {

    function _success(position) {
      _position = position.coords;
      $('body > section > header > menu > a .icon').removeClass('waiting');
      _isGPS = true;
    }

    function _error() {
      _isGPS = undefined;
    }

    if (window.navigator.geolocation !== undefined) {
      _positionWatch = window.navigator.geolocation.watchPosition(_success, _error);
    }
  }

  /**
    Method removes SearchVenue from DOM and unbinds events.

    @method _remove
    @for SearchVenue
    @static
    @private
  */
  function _remove() {
    $('input').off('keyup', _updateSearch);
    $('ul.venues > li').off('click', _itemClick);
    if (_positionWatch !== undefined) {
      window.navigator.geolocation.clearWatch(_positionWatch);
    }
    $('body > section > header > menu').remove();
  }

  /**
    Method is called when user request GPS status information.

    @method _showGPSStatus
    @for SearchVenue
    @param {Object} event object.
    @static
    @private
  */
  function _showGPSStatus(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    if (_isGPS === undefined) {
      _drawer.showStatus('<strong>GPS</strong> device is unavailable');
    } else if (_isGPS === true) {
      _drawer.showStatus('Now we have your <strong>GPS</strong> position!');
    } else {
      _drawer.showStatus('Still waiting for <strong>GPS</strong>...');
    }
  }

  /**
    Method is called when SearchVenue object is initialised.

    @method _initialize
    @for SearchVenue
    @param {Object} drawer object.
    @static
    @private
  */
  function _initialize() {

    _drawer = new Drawer(_remove);
    _drawer.setTitle('Search venue');

    $('section header a').last().on('click', _drawer.removeWindow);
    $('section div[role="main"]').last().html(_.template(template));
    $('input').on('keyup', _updateSearch);
    _getPosition();
    _getGPSPosition();

    $('body > section > header').prepend('<menu type="toolbar"><a href="#search"><span class="icon icon-gps-status waiting">GPS</span></a></menu>');
    $('body > section > header > menu > a .icon').on('click', _showGPSStatus);
  }

  /**
    SearchVenue view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class SearchVenue
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
    remove: _remove
  });
});
