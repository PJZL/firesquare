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
  'view/login',
  'router'
], function (Login, Router) {
  'use strict';

  //return new Login();

  var _router = new Router();
  Backbone.history.start(_router); //For jslint
});
