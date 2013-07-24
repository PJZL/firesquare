define([
  'view/recent'
], function (Recent) {
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
      default route method.

      @method default
    */
    'default': function() {
      this.navigate('recent', {trigger : true});
    }
  });
});
