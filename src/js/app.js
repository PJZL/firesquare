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
  'view/login'
], function (Login) {
  'use strict';
  return new Login();
});
