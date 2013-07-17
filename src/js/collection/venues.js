define([
  'model/venue',
  'model/service'
], function (Checkin, service) {
  'use strict';

  return Backbone.Collection.extend({
    model: Checkin,
    parse: function(data) {
      if (typeof data === 'string') {
        return JSON.parse(data).response.recent;
      }
      return data.response.recent;
    },
    url: function() {
      return 'https://api.foursquare.com/v2/checkins/recent?oauth_token=' + service.foursquare.get('access_token');
    },
    comparator: function(item) {
      return -parseInt(item.get('id'), 10);
    }
  });
});