define([
  'collection/recent',
  'model/service'
], function (Recent, Service) {
  'use strict';

  module('Recent');

  test('module', function() {
    var recent;

    deepEqual(typeof Recent, 'function', 'module is loaded');
    recent = new Recent();
    deepEqual(typeof recent, 'object', 'constructor returns object');
  });

  test('`parse` function', function() {
    var recent = new Recent(),
      data = {
        response: {
          recent: {
            value: 'test'
          }
        }
      };

    deepEqual(recent.parse(data), data.response.recent, 'returns `recent` object');
    deepEqual(recent.parse(JSON.stringify(data)), data.response.recent, 'parses and returns `recent` object');
  });

  test('`comparator` function', 2, function() {
    var recent = new Recent(),
      idVal = 10,
      item = {
        get: function(id) {
          if (id === 'id') {
            ok(true, 'compares by id');
          } else {
            ok(false, 'should compare by id');
          }
          return idVal;
        }
      };

    deepEqual(recent.comparator(item), -idVal, 'returns negative value of id');
  });

  test('`url` function', function() {
    var recent = new Recent(),
      token = 'some_token';

    Service.foursquare.set('access_token', token);
    deepEqual(recent.url(), 'https://api.foursquare.com/v2/checkins/recent?oauth_token=' + token, 'returns valid url');
  });
});
