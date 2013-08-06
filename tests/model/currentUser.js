define([
  'model/currentUser',
  'model/service',
  'mock/foursquare.users.self'
], function (CurrentUser, Service, Mock) {
  'use strict';

  module('model.self');

  test('module', function() {
    deepEqual(typeof CurrentUser, 'object', 'module is loaded');
    deepEqual(CurrentUser.get('isAuth'), false, 'user is not authenticated');
  });

  asyncTest('authentication', function() {
<<<<<<< HEAD:tests/model/currentUser.js
    CurrentUser.once('change', function(self) {
      deepEqual(self.get('isAuth'), true, 'user is authenticated');
=======

    function success() {
      ok(true, 'user authentication successed');
      deepEqual(Self.get('isAuth'), true, 'user is authenticated');
      start();
    }

    function error() {
      ok(false, 'user authentication fail');
>>>>>>> upstream/unstable:tests/model/self.js
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
