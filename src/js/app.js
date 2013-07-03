require.config({
  paths: {
    text: 'lib/text',
    template: '../template',
    root: '..'
  }
});

require([
  'router'
], function (Router) {
  'use strict';

  var router = new Router();
  Backbone.history.start();
});
