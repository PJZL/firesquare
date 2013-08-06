define([
  'view/recent',
  'view/searchVenue',
  'view/login',
  'view/logging',
  'view/drawer',
  'model/self',
  'model/service'
], function (Recent, SearchVenue, Login, Logging, Drawer, Self, Service) {
  'use strict';

  var _currentView;

  function _removeCurrentView() {
    if (_currentView !== undefined) {
      _currentView.remove();
      _currentView = undefined;
    }
  }

  function _loadDrawer() {
    if (!(_currentView instanceof Drawer)) {
      _removeCurrentView();
      _currentView = new Drawer();
    }
  }

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
      _removeCurrentView();
      _currentView = new Login();
    },

    logging: function() {
      _removeCurrentView();
      _currentView = new Logging();
    },

    /**
      `recent` route method.

      @method recent
    */
    recent: function() {_before(function() {
      _loadDrawer();
      return new Recent();
    })},

    /**
      `search` route method.

      @method search
    */
    search: function() {_before(function() {
      _loadDrawer();
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
