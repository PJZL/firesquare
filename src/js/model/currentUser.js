define([
  'model/user',
  'model/service'
], function(User, service) {
  'use strict';

  /**
    Current user object. Is initialized unauthenticated. This object is returned when CurrentUser module is initialized.

    @property _user
    @type User
    @private
    @static
  */
  var _user = new User({isAuth: false});

  /**
    Authentication method callback.

    @method _authCallback
    @for CurrentUser
    @static
    @private
  */
  function _authCallback(data) {

    var _data;

    if (typeof data === 'string') {
      //on Firefox OS data is string type
      _data = JSON.parse(data).response.user;
    } else {
      //on desktop browser data is object type
      _data = data.response.user;
    }

    _data.isAuth = true;
    _user.set(_data);
  }

  /**
    Authentication method called when foursquare service token changes.

    @method _auth
    @for CurrentUser
    @static
    @private
  */
  function _auth() {
    $.get(
      'https://api.foursquare.com/v2/users/self?oauth_token=' + service.foursquare.get('access_token'),
      _authCallback
    );
  }

  /*
    Bind service on change event.
  */
  service.foursquare.on('change:access_token', _auth);

  /**
    Current user object.

    @class CurrentUser
    @namespace Model
    @static
  */
  return _user;
});
