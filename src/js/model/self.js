define([
  'model/user',
  'model/service'
], function (User, service) {

  var _user = new User({isAuth: false});

  function _authCallback(data) {
    _user.set({
      id: data.response.user.id,
      isAuth: true
    });
  }

  function _auth() {
    console.log('self', service.foursquare.get('access_token'));
    $.get(
      "https://api.foursquare.com/v2/users/self?oauth_token=" + service.foursquare.get('access_token'),
      function(data){
        _authCallback(data);
      }
    )
  }

  service.foursquare.on('change:access_token', _auth);

  return _user;
});