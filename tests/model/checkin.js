define([
  'model/checkin',
  'model/service'
], function (Checkin, Service) {
  'use strict';

  module('model.checkin');

  test('module', function() {
    deepEqual(typeof Checkin, 'function', 'module is loaded');
    deepEqual(typeof new Checkin(), 'object', 'constructor returns object');
  });

  test('`parse` function', function() {
    var checkin = new Checkin(),
      data = {
        response: {
          checkin: {
            value: 'test'
          }
        }
      };

    deepEqual(checkin.parse(data), data.response.checkin, 'returns `checkin` object');
    deepEqual(checkin.parse(data.response.checkin), data.response.checkin, 'parses and returns `checkin` object');
  });

  test('`urlRoot` function', function() {
    var checkin = new Checkin({id: 100}),
      token = 'some_token';

    Service.foursquare.set('access_token', token);
    deepEqual(checkin.urlRoot(), 'https://api.foursquare.com/v2/checkins/' + checkin.get('id') + '?oauth_token=' + token + '&', 'returns valid url');
  });
});
