define([
  'view/recent',
  'view/login',
  'model/self'
], function (Recent, Login, Self) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      '*actions': 'default'
    },

    route: function(route, name, callback) {

      var that = this,
        redirect = name;

      if (!Self.get('isAuth')) {
        name = 'login';
        Self.on('change:isAuth', function() {
          Self.off('change:isAuth', this);
          that[redirect]();
        });
      }

      return Backbone.Router.prototype.route.call(this, route, name, callback);
    },

    'default': function() {
      console.log('default');
    },

    login: function() {
      var login = new Login();
    }
  });
});
