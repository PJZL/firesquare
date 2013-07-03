define([
  'text!template/recent.html',
  'view/drawer'
], function (template, Drawer){

  return Backbone.View.extend({
    initialize: function() {
      console.log('it works!');
    }
  });
});
