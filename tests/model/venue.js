define([
  'model/venue',
  'model/service',
  'mock/foursquare.checkins.add'
], function (Venue, Service, Mock) {
  'use strict';

  module('model.venue');

  test('module', function() {
    deepEqual(typeof Venue, 'function', 'module is loaded');
    deepEqual(typeof new Venue(), 'object', 'constructor returns object');
  });

  test('`parse` function', function() {
    var venue = new Venue(),
      data = {
        response: {
          venue: {
            value: 'test'
          }
        }
      };

    deepEqual(venue.parse(data), data.response.venue, 'returns `venue` object');
    deepEqual(venue.parse(data.response.venue), data.response.venue, 'parses and returns `venue` object');
  });

  test('`urlRoot` function', function() {
    var venue = new Venue({id: 100}),
      token = 'some_token';

    Service.foursquare.set('access_token', token);
    deepEqual(venue.urlRoot(), 'https://api.foursquare.com/v2/venues/' + venue.get('id') + '?oauth_token=' + token + '&', 'returns valid url');
  });

  asyncTest('checkin', function() {
    var venue = new Venue({id: 100});

    function success() {
      start();
      ok(true);
    }

    function error() {
      start();
      ok(false);
    }

    Service.foursquare.set('access_token', Mock.accessToken);
    venue.checkin({success: success, error: error});
  });
});
