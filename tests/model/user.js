define([
  'model/user',
  'model/service'
], function (User, Service) {
  'use strict';

  module('model.user');

  test('module', function() {
    deepEqual(typeof User, 'function', 'module is loaded');
    deepEqual(typeof new User(), 'object', 'constructor returns object');
  });

  test('`parse` function', function() {
    var user = new User(),
      data = {
        response: {
          user: {
            value: 'test'
          }
        }
      };

    deepEqual(user.parse(data), data.response.user, 'returns `user` object');
  });

  test('`urlRoot` function', function() {
    var user = new User({id: 100}),
      token = 'some_token';

    Service.foursquare.set('access_token', token);
    deepEqual(user.urlRoot(), 'https://api.foursquare.com/v2/users/' + user.get('id') + '?oauth_token=' + token + '&', 'returns valid url');
  });
});
