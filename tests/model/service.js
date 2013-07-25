define([
  'model/service'
], function (Service) {
  'use strict';

  module('Service');

  test('module', function() {
    deepEqual(typeof Service, 'object', 'module is loaded');
    notDeepEqual(Service.foursquare, undefined, 'foursquare property is defined');
    deepEqual(typeof Service.foursquare, 'object', 'foursquare property is object');
  });
});
