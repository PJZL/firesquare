define([], function() {
  'use strict';

  /** 
    Current foursquare service object.

    @property _foursquare
    @type Backbone.Model
    @private
    @static
  */
  var _foursquare = new Backbone.Model();

  /**
    This object contains public properties that ponts to static service models. Service models contails authentication details.

    @class Service
    @namespace Model
    @static
  */
  return {
    /** 
      Current foursquare service object.

      @property foursquare
      @type Backbone.Model
    */
    foursquare: _foursquare
  };
});