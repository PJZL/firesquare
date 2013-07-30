define([
  'router',
  'text!template/login.html',
  'text!template/spinner.html',
  'text!root/config.json',
  'model/service',
  'model/self'
], function (Router, template, spinnerTemplate, config, service, self) {
  'use strict';
  var _window,
    _router,
    _initialize,
    _message,
    _exit,
    _remove;

  /**
    Method is called when user clicks on `Login` button. Foursquare oauth window is open.

    @method _login
    @for Login
    @param {Object} event
    @static
    @private
  */
  function _login(event) {
    event.preventDefault();

    var conf = JSON.parse(config),
      url = 'https://foursquare.com/oauth2/authenticate?'
          + 'client_id='
          + conf.services.foursquare.client_id
          + '&response_type=token'
          + '&redirect_uri='
          + conf.services.foursquare.api_endpoint
          + window.location.protocol + '/' + window.location.host;

    _window = window.open(url);
  }

  /**
    Method is called after login and first data fetch from foursquare.

    @method _selfAuth
    @for Login
    @static
    @private
  */
  function _selfAuth() {
    if (!self.get('isAuth')) {
      _initialize();
    } else {
      _router = new Router();
      Backbone.history.start(_router); //For jslint
    }
  }

  /**
    Method is called after response from oauth endpoint is recived.

    @method _message
    @for Login
    @param {Object} event `window` on `message` event.
    @static
    @private
  */
  _message = function (event) {
    var access_token = event.originalEvent.data.access_token;

    if (access_token !== undefined) {
      self.on('change:isAuth', _selfAuth);
      service.foursquare.set('access_token', access_token);
      _remove();
      $('body').html(_.template(spinnerTemplate, {message: 'Logging in ...', button1: undefined, button2: undefined}));
    }
    _window.close();
  };

  /**
    Method is called when Login object is initialised.

    @method _initialize
    @for Login
    @static
    @private
  */
  _initialize = function () {
    $('body').html(_.template(template));
    $(window).on('message', _message);
    $('.login').on('click', _login);
    $('.exit').on('click', _exit);
  };

  /**
    Method removes Login from DOM and unbinds events.

    @method _remove
    @for Login
    @static
    @private
  */
  _remove = function () {
    $('.login').on('click', _login);
    $('.exit').on('click', _exit);
    $(window).off('message', _message);
  };

  /**
    Method is called when user clicks on `exit` button.

    @method _exit
    @for Login
    @static
    @private
  */
  _exit = function () {
    _remove();
    window.close();
  };

  /**
    Login view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class Login
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
     /**
      Method is called when new Drawer object is created. It points to {{#crossLink "Login/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for Login
      @constructor
    */
    initialize: _initialize
  });
});