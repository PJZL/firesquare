define([
  'view/recent'
], function (Recent) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      'recent':   'recent',
      'none':     'none',
      '*actions': 'default'
    },

    recent: function() {
      return new Recent();
    },

    'default': function() {
      return this.recent();
    }
  });
});
