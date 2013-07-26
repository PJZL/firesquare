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

  function _itemClick(element) {
    element.preventDefault();

    return new VenueView(
      new VenueModel(
        {id: $(element.currentTarget).attr('id')}
      ),
      _drawer
    );
  }

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

  function _getGPSPosition() {

    function _success(position) {
      _position = position.coords;
      console.log(_position);
    }

    if ("geolocation" in navigator) {
      _positionWatch = navigator.geolocation.watchPosition(_success);
    } 
  }

  function _remove(event) {
    event.preventDefault();
    _drawer.removeWindow();
    $('input').off('keyup', _updateSearch);
    $('ul.venues > li').off('click', _itemClick);
    if (_positionWatch !== undefined) {
      navigator.geolocation.clearWatch(_positionWatch);
    }
  }

  function _initialize(drawer) {

    _drawer = drawer;
    _drawer.setWindow('Search venue');

    $('section header a').last().on('click', _remove);
    $('section div[role="main"]').last().html(_.template(template));
    $('input').on('keyup', _updateSearch);
    _getPosition();
    _getGPSPosition();
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});