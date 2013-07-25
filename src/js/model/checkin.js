define([
  'model/service'
], function (service) {
  'use strict';

  /**
    Checkin model that is extension of [Backbone.Model](http://backbonejs.org/#Model).

    @class Checkin
    @namespace Model
    @extends Backbone.Model
  */
  return Backbone.Model.extend({
    /**
      Overrides default model `urlRoot`.

      @method urlRoot
      @return {String} Recent model API endpoint with current access_token and object id.
    */
    urlRoot: function() {
      return 'https://api.foursquare.com/v2/checkins/'
        + this.get('id') + '?oauth_token=' + service.foursquare.get('access_token') + '&';
    },

    /**
      Overrides default model `parse` function. Data returned from foursquare API endpoint differs from backbone expectations.

      @method parse
      @param {Object} data
      @return {Object} Checkin object.
    */
    parse: function(data) {
      /* 
        When data is from foursquare API
      */
      if (data.response !== undefined) {
        return data.response.checkin;
      }
      /*
        When data is form collection
      */
      return data;
    }
  });

});