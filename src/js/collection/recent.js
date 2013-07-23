define([
  'model/checkin',
  'model/service'
], function (Checkin, service) {
  'use strict';

  /**
    Recent collection that is extension of [Backbone.Collection](http://backbonejs.org/#Collection).

    @class Recent
    @namespace Collection
    @extends Backbone.Collection
  */
  return Backbone.Collection.extend({
    /**
      Defines model used by collection.

      @property model 
      @type {Checkin}
      @readOnly
    */
    model: Checkin,

    /**
      Overrides default collection `parse` function. Data returned from foursquare API endpoint differs from backbone expectations.

      @method parse
      @param {Object} data On firefox OS this object occures as a string!
      @return {Array} Recent {{#crossLink "Checkin"}}{{/crossLink}} objects.
    */
    parse: function(data) {
      if (typeof data === 'string') {
        return JSON.parse(data).response.recent;
      }
      return data.response.recent;
    },

    /**
      Overrides default collection `url` function.

      @method url
      @return {String} Recent collection API endpoint with current access_token.
    */
    url: function() {
      return 'https://api.foursquare.com/v2/checkins/recent?oauth_token=' + service.foursquare.get('access_token');
    },

    /**
      Overrides default collection `comparator` function. Last checkin is the first on the list.

      @method comparator
      @param {Object} item Collection item.
      @return {Number} Negative value of object id.
    */
    comparator: function(item) {
      return -parseInt(item.get('id'), 10);
    }
  });
});