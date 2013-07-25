define([
  'model/self',
  'model/service',
  'mock/foursquare.self'
], function (Self, Service, Mock) {
  'use strict';

  module('Self');

  test('module', function() {
    deepEqual(typeof Self, 'object', 'module is loaded');
    deepEqual(Self.get('isAuth'), false, 'user is not authenticated');
  });

  asyncTest('authentication', function() {
    Self.once('change', function(self) {
      deepEqual(self.get('isAuth'), true, 'user is authenticated');
      start();
    });
    Service.foursquare.set('access_token', Mock.accessToken);
  });
});
