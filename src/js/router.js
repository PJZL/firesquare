define([
  'view/recent',
  'view/searchVenue',
  'view/login',
  'view/logging',
  'model/self',
  'model/service'
], function (Recent, SearchVenue, Login, Logging, Self, Service) {
  'use strict';

  var _login,
    _logging,
    _drawer;

  function _before(callback) {
    if (Self.get('isAuth')) {
      //user is authenticated - nothing to do here.
      callback();
    } else {
      if (Service.foursquare.get('access_token') === undefined) {
        // We don't have an access token so we need to log in first.
        window.location.hash = '#login';
        //this.navigate('login', {trigger : true});
      } else {
        //We already have access token se we need to check if it's valid.
        window.location.hash = '#logging';
        //this.navigate('logging', {trigger : true});
      }
    }
  }

  /**
    Router object that is extension of [Backbone.Router](http://backbonejs.org/#Router).

    @class Router
    @extends Backbone.Router
  */
  return Backbone.Router.extend({
    /**
      Defines routing rules.

      @property routes 
      @type {Object}
      @readOnly
    */
    routes: {
      'recent':   'recent',
      'search':   'search',
      'login':    'login',
      'logging':  'logging',
      '*actions': 'default'
    },

    login: function() {
      return new Login();
    },

    logging: function() {
      return new Logging();
    },

    /**
      `recent` route method.

      @method recent
    */
    recent: function() {_before(function() {
      return new Recent();
    })},

    /**
      `search` route method.

      @method search
    */
    search: function() {_before(function() {
      return new SearchVenue();
    })},

    /**
      default route method.

      @method default
    */
    'default': function() {
      this.navigate('recent', {trigger : true});
    }
  });
});
