define([
  'model/currentUser',
  'model/service',
  'mock/foursquare.users.self'
], function (CurrentUser, Service, Mock) {
  'use strict';

  module('model.currentUser');

  test('module', function() {
    deepEqual(typeof CurrentUser, 'object', 'module is loaded');
    deepEqual(CurrentUser.get('isAuth'), false, 'user is not authenticated');
  });

  asyncTest('authentication', function() {

    function success() {
      ok(true, 'user authentication successed');
      deepEqual(CurrentUser.get('isAuth'), true, 'user is authenticated');
      start();
    }

    function error() {
      ok(false, 'user authentication fail');
      start();
    }

    Service.foursquare.set('access_token', Mock.accessToken);
    CurrentUser.auth(success, error);
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
    CurrentUser.auth(success, error);
  });
});
