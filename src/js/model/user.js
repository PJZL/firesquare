define([
  'model/service'
], function (service) {
  'use strict';

  /**
    User model that is extension of Backbone.Model.

    @class User
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
      return 'https://api.foursquare.com/v2/users/'
        + this.get('id') + '?oauth_token=' + service.foursquare.get('access_token') + '&';
    },

    /**
      Overrides default model `parse` function. Data returned form foursquare API endpoint differs from backbone expectations.

      @method parse
      @param {Object} data
      @return {Object} User object.
    */
    parse: function(data) {
      return data.response.user;
    }
  });

});