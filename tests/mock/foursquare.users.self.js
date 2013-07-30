define([], function () {
  'use strict';

  var _accessToken = '1234567890';

  $.mockjax({
    url: /^https\:\/\/api\.foursquare\.com\/v2\/users\/self\?oauth_token=([\w\W]*)$/,
    urlParams: ['oauth_token'],
    contentType: 'text/json',
    response: function(settings) {
      if (settings.urlParams.oauth_token !== _accessToken) {
        this.responseJSON = {
          "meta": {
            "code": 401,
            "errorType": "invalid_auth",
            "errorDetail": "OAuth token invalid or revoked."
          },
          "response": {}
        };
        this.status = 401;
      } else {
        this.responseText = '{"response": {"user": {}}}';
      }
    }
  });

  return {
    accessToken: _accessToken
  };
});
