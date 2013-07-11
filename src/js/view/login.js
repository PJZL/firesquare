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

  function _selfAuth() {
    if (!self.get('isAuth')) {
      _initialize();
    } else {
      _router = new Router();
      Backbone.history.start(_router); //For jslint
    }
  }

  _message = function (event) {
    var access_token = event.originalEvent.data.access_token;

    if (access_token !== undefined) {
      self.on('change:isAuth', _selfAuth);
      service.foursquare.set('access_token', access_token);
      _remove();
      $('body').html(_.template(spinnerTemplate, {message: 'Logging in ...'}));
    }
    _window.close();
  };

  _initialize = function () {
    $('body').html(_.template(template));
    $(window).on('message', _message);
    $('.login').on('click', _login);
    $('.exit').on('click', _exit);
  };

  _remove = function () {
    $('.login').on('click', _login);
    $('.exit').on('click', _exit);
    $(window).off('message', _message);
  };

  _exit = function () {
    _remove();
    window.close();
  };

  return Backbone.View.extend({
    initialize: _initialize
  });
});