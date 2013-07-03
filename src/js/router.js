define([
  'view/recent',
  'view/login',
  'model/self'
], function (Recent, Login, self) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      '*actions': 'default'
    },

    route: function(route, name, callback) {

      var that = this,
        redirect = name;

      if (!self.get('isAuth')) {
        name = 'login';
        self.on('change:isAuth', function() {
          self.off('change:isAuth', this);
          that[redirect]();
        });
      }

      return Backbone.Router.prototype.route.call(this, route, name, callback);
    },

    'default': function() {
      var recent = new Recent();
    },

    login: function() {
      var login = new Login();
    }
  });
});
