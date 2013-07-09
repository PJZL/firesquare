define([
  'model/user',
  'model/service'
], function(User, service) {
  'use strict';

  var _user = new User({isAuth: false});

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

  function _auth() {
    $.get(
      'https://api.foursquare.com/v2/users/self?oauth_token=' + service.foursquare.get('access_token'),
      _authCallback
    );
  }

  service.foursquare.on('change:access_token', _auth);

  return _user;
});
