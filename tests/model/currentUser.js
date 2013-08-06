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
    CurrentUser.once('change', function(self) {
      deepEqual(self.get('isAuth'), true, 'user is authenticated');
      start();
    });
    Service.foursquare.set('access_token', Mock.accessToken);
  });
});
