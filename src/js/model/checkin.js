define([
  'model/service'
], function (service) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: function() {
      return 'https://api.foursquare.com/v2/checkins/'
        + this.get('id') + '?oauth_token=' + service.foursquare.get('access_token') + '&';
    },
    parse: function(data) {
      if (data.response !== undefined) {
        return data.response.checkin;
      }
      return data;
    }
  });

});