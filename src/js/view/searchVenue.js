define([
  'text!template/searchVenue.html',
  'model/service'
], function(template, service) {
  'use strict';

  var _drawer,
    _position,
    _search;

  //http://freegeoip.net/
  function _updateSearch() {

    function _callback(data) {
      console.log(data);
    }

    if (_position !== undefined && 
        $('input').val() !== '') {
      $.get(
      'https://api.foursquare.com/v2/venues/search?ll=' + _position.latitude + ',' + _position.longitude + '&oauth_token=' + service.foursquare.get('access_token') + '&query=' + $('input').val(),
      _callback
    );
    }
  }

  function _getPosition() {

    function _callback(data){
      if (typeof data === 'string') {
        _position = JSON.parse(data);
      } else {
        _position = data;
      }
      _updateSearch();
    };

    $.get(
      'http://freegeoip.net/json/',
      _callback
    );
  }

  function _initialize(drawer) {
    var i,
      notif = {};

    _drawer = drawer;
    _drawer.setWindow('Search venue');

    $('section header a').last().on('click', _remove);
    $('section div[role="main"]').last().html(_.template(template));
    $('input').on('keyup', _updateSearch);
    _getPosition();
  }

  function _remove(event) {
    event.preventDefault();
    if (_watch !== undefined) {
      navigator.geolocation.clearWatch(_watch);
    }
    _drawer.removeWindow();
    $('input').off('keyup', _updateSearch);
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});