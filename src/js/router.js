define([
  'view/recent',
  'view/searchVenue',
  'view/login',
  'view/logging',
  'view/drawer',
  'model/currentUser',
  'model/service'
], function (Recent, SearchVenue, Login, Logging, Drawer, CurrentUser, Service) {
  'use strict';

  var _currentView;

  /**
    Method calls remove function on current main view if deffined.

    @method _removeCurrentView
    @for Router
    @static
    @private
  */
  function _removeCurrentView() {
    if (_currentView !== undefined) {
      _currentView.remove();
      _currentView = undefined;
    }
  }

  /**
    Method check if current main view is Drawer. If it is not, current main view is removed and Drower is loaded.

    @method _loadDrawer
    @for Router
    @static
    @private
  */
  function _loadDrawer() {
    if (!(_currentView instanceof Drawer)) {
      _removeCurrentView();
      _currentView = new Drawer();
    }
  }

  /**
    Method check if user is authenticated. If not it loads `login` or `logging` view.

    @method _before
    @for Router
    @param {function} callback function that loads requested view.
    @static
    @private
  */
  function _before(callback) {
    if (CurrentUser.get('isAuth')) {
      //user is authenticated - nothing to do here.
      callback();
    } else {
      if (Service.foursquare.get('access_token') === undefined) {
        // We don't have an access token so we need to log in first.
        Backbone.history.navigate('/login', true);
      } else {
        //We already have access token se we need to check if it's valid.
        Backbone.history.navigate('/logging', true);
      }
    }
  }

  //Configure AJAX to load login page when user token is not valid anymore.
  $.ajaxSetup({
    statusCode: {
      401: function() {
        //Redirect the to the login page if not already there.
        if (!(_currentView instanceof Login) &&
            !(_currentView instanceof Logging)) {
          CurrentUser.set('isAuth', false);
          Service.foursquare.set('access_token', undefined);
          Backbone.history.navigate('/login', true);
        }
      }//,
      /*TODO:403: function() {
        // 403 -- Access denied
        Backbone.history.navigate('/login', true);
      }*/
    }
  });

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

    /**
      `login` route method.

      @method login
    */
    login: function() {
      _removeCurrentView();
      _currentView = new Login();
    },

    /**
      `logging` route method.

      @method logging
    */
    logging: function() {
      _removeCurrentView();
      _currentView = new Logging();
    },

    /**
      `recent` route method.

      @method recent
    */
    recent: function() {
      _before(function() {
        _loadDrawer();
        return new Recent();
      });
    },

    /**
      `search` route method.

      @method search
    */
    search: function() {
      _before(function() {
        _loadDrawer();
        return new SearchVenue();
      });
    },

    /**
      default route method.

      @method default
    */
    'default': function() {
      this.navigate('recent', {trigger : true});
    }
  });
});
