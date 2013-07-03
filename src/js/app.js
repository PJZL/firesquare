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

  new Router();
  Backbone.history.start();
});
