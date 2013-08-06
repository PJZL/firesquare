define([
  'model/self',
  'model/service',
  'mock/foursquare.users.self'
], function (Self, Service, Mock) {
  'use strict';

  module('model.self');

  test('module', function() {
    deepEqual(typeof Self, 'object', 'module is loaded');
    deepEqual(Self.get('isAuth'), false, 'user is not authenticated');
  });

  asyncTest('authentication', function() {

    function success() {
      ok(true, 'user authentication successed');
      deepEqual(Self.get('isAuth'), true, 'user is authenticated');
      start();
    }

    function error() {
      ok(false, 'user authentication fail');
      start();
    }

    Service.foursquare.set('access_token', Mock.accessToken);
    Self.auth(success, error);
  });

  asyncTest('authentication error', function() {

    function success() {
      ok(false, 'user is authenticated');
      start();
    }

    function error() {
      ok(true, 'user authentication fail');
      start();
    }

    Service.foursquare.set('access_token', 'some invalid token');
    Self.auth(success, error);
  });
});
