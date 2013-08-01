define([], function () {
  'use strict';

  var _accessToken = '1234567890';

  $.mockjax({
    url: /^https\:\/\/api\.foursquare\.com\/v2\/checkins\/add$/,
    contentType: 'text/json'
  });

  return {
    accessToken: _accessToken
  };
});
