/** 
  This is main module.

  @module App
*/
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

  //load default router
  var _router = new Router();
  //Begin Backbone history.
  Backbone.history.start(_router); //For jslint
});
