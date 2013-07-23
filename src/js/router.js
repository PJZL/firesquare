define([
  'view/recent'
], function (Recent) {
  'use strict';

  /**
    Router object that is extension of Backbone.Router.

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
      'none':     'none',
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
      return this.recent();
    }
  });
});
