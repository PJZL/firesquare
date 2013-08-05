define([
  'view/recent',
  'view/searchVenue'
], function (Recent, SearchVenue) {
  'use strict';

  /**
    Router object that is extension of [Backbone.Router](http://backbonejs.org/#Router).

    @class Router
    @extends Backbone.Router
  */
  return Backbone.Router.extend({
    /**
      Defines routing rules.

      @property routes 
      @type {Object}
      @readOnly
    */
    routes: {
      'recent':   'recent',
      'search':   'search',
      '*actions': 'default'
    },

    /**
      `recent` route method.

      @method recent
    */
    recent: function() {
      return new Recent();
    },

    /**
      `search` route method.

      @method search
    */
    search: function() {
      return new SearchVenue();
    },

    /**
      default route method.

      @method default
    */
    'default': function() {
      this.navigate('recent', {trigger : true});
    }
  });
});
