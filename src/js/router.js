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

    none: function(){},

    'default': function() {
      var recent = new Recent();
    },

    recent: function() {
      var recent = new Recent();
    }

  });
});
