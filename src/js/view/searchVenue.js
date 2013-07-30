define([
  'text!template/searchVenue.html',
  'text!template/searchVenueItem.html',
  'model/service',
  'model/venue',
  'model/self',
  'view/venue'
], function(template, itemTemplate, service, VenueModel, Self, VenueView) {
  'use strict';

  var _drawer,
    _position,
    _search,
    _positionWatch;

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
      $('ul.venues').html('<progress style="left: 50%; top: 50%; margin-left: -3.2rem; margin-top: 3.2rem; position: relative;"></progress>');
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
      if (typeof data === 'string') {
        _position = JSON.parse(data);
      } else {
        _position = data;
      }
      _updateSearch();
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
    if (_position === undefined) {
      if (Self.get('checkins').items.length > 0) {
        venue = Self.get('checkins').items[0].venue;
        _position = {
          latitude: venue.location.lat,
          longitude: venue.location.lng
        };
      } else {
        _getPositionFallback();
      }
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
    }

    if (window.navigator.geolocation !== undefined) {
      _positionWatch = window.navigator.geolocation.watchPosition(_success);
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
  }

  /**
    Method is called when SearchVenue object is initialised.

    @method _initialize
    @for SearchVenue
    @param {Object} drawer object.
    @static
    @private
  */
  function _initialize(drawer) {

    _drawer = drawer;
    _drawer.setWindow('Search venue', _remove);

    $('section header a').last().on('click', _drawer.removeWindow);
    $('section div[role="main"]').last().html(_.template(template));
    $('input').on('keyup', _updateSearch);
    _getPosition();
    _getGPSPosition();
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
