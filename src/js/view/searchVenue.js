define([
  'text!template/searchVenue.html',
  'text!template/searchVenueItem.html',
  'model/service',
  'model/venue',
  'model/currentUser',
  'view/venue',
  'view/drawer'
], function(template, itemTemplate, Service, VenueModel, CurrentUser, VenueView, Drawer) {
  'use strict';

  var _drawer,
    _position = {
      gps: undefined,
      checkin: undefined,
      service: undefined
    },
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
    Method updates current user rearch results. If we don't have GPS position we check for last checkin and external service.
    If checkin and service have different countries we always trust external service. We assume that no one uses proxy on cellphone.

    @method _updateSearch
    @for SearchVenue
    @static
    @private
  */
  function _updateSearch() {

    var input = $('input');

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

    function _showProgress() {
      $('ul.venues > li').off('click', _itemClick);
      $('ul.venues').html('<progress class="centre top"></progress>');
    }

    function _getSearch(position) {
      if (_search !== undefined) {
        _search.abort();
      }
      _search = $.get(
        'https://api.foursquare.com/v2/venues/search?ll=' + position.latitude + ',' + position.longitude + '&oauth_token=' + Service.foursquare.get('access_token') + '&query=' + $('input').val(),
        _callback
      );
    }

    //Check if we have any position.
    if (((_position.gps !== undefined && _position.gps !== false) ||
        _position.checkin !== undefined ||
        _position.service !== undefined) &&
        input.val() !== '') {
      _showProgress();
      //If we have a gps position.
      if (_position.gps !== undefined && _position.gps !== false) {
        _getSearch(_position.gps);
      } else if (_position.checkin !== undefined &&
          _position.service !== undefined) {
        //If we have both checkin and service. Service country should be right.
        if (_position.checkin.country !== _position.service.country_name) {
          _getSearch(_position.service);
        } else {
          _getSearch(_position.checkin);
        }
      } else if (_position.checkin !== undefined) {
        _getSearch(_position.checkin);
      } else {
        _getSearch(_position.service);
      }
    }
  }

  /**
    Method actualize current user position using GPS.

    @method _getGPS
    @for SearchVenue
    @static
    @private
  */
  function _getGPS() {
    function _success(position) {
      _position.gps = position.coords;
      $('body > section > header > menu > a .icon').removeClass('waiting');
      _updateSearch();
    }

    function _error() {
      _position.gps = false;
    }

    if (window.navigator.geolocation !== undefined) {
      _positionWatch = window.navigator.geolocation.watchPosition(_success, _error);
    }
  }

  /**
    Method fetch current user position from last checkin.

    @method _getGPS
    @for SearchVenue
    @static
    @private
  */
  function _getCheckin() {

    function _callback() {
      var venue;

      if (CurrentUser.get('checkins').items.length > 0) {
        venue = CurrentUser.get('checkins').items[0].venue;
        _position.checkin = venue.location;
        _position.checkin.latitude = venue.location.lat;
        _position.checkin.longitude = venue.location.lng;
        _updateSearch();
      }
    }

    //If we fail to reset model state, use last avaliable checkin.
    CurrentUser.fetch({
      success: _callback,
      error: _callback
    });
  }

  /**
    Method fetch current user position from freegeoip.net service.

    @method _getGPS
    @for SearchVenue
    @static
    @private
  */
  function _getService() {

    function _callback(data) {
      var dataJson;

      if (typeof data === 'string') {
        dataJson = JSON.parse(data);
      } else {
        dataJson = data;
      }

      _position.service = dataJson;
      _updateSearch();
    }

    $.get(
      'http://freegeoip.net/json/',
      _callback
    );
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
    if (_position.gps === undefined) {
      _drawer.showStatus('Still waiting for <strong>GPS</strong> signal. You can try to search anyway.');
    } else if (_position.gps === false) {
      _drawer.showStatus('<strong>GPS</strong> device is unavailable');
    } else {
      _drawer.showStatus('Now we have your <strong>GPS</strong> position!');
    }
  }

  /**
    Method is called when SearchVenue object is initialized.

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
    _getGPS();
    _getCheckin();
    _getService();

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
