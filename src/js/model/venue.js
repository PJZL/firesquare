define([
  'model/service'
], function (service) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: function() {
      return 'https://api.foursquare.com/v2/venues/'
        + this.get('id') + '?oauth_token=' + service.foursquare.get('access_token') + '&';
    },
    parse: function(data) {
      //when data is from service it has response that contains true data
      if (data.response !== undefined) {
        return data.response.venue;
      }
      //when data is just data
      return data;
    },
    checkin: function(success, error){
      return $.ajax({
        url: 'https://api.foursquare.com/v2/checkins/add',
        data: {
          venueId:      this.get('id'),
          oauth_token:  service.foursquare.get('access_token'),
          //shout:        'Nie ma mnie tu! - to tylko test!'
        },
        success: success,
        error: error,
        type: 'POST'
      });
    }
  });

});