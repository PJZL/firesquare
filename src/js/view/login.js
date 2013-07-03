define([
  'text!template/login.html',
  'text!root/config.json',
  'model/service'
], function (template, config, service){

  var _window;

  function _login(event){
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

  function _message(event){
    var access_token = event.originalEvent.data.access_token;

    if (access_token !== undefined) {
      service.foursquare.set('access_token', access_token);
      _remove();
    }
    _window.close();
  }

  function _initialize() {
    $('body').append(_.template(template));
    $(window).on('message', _message);
    $('.login').on('click', _login);
    $('.exit').on('click', _exit);
  }

  function _remove(){
    $('.login').on('click', _login);
    $('.exit').on('click', _exit);
    $(window).off('message', _message);
    $('body').empty();
  }

  function _exit() {
    _remove();
    _window.close();
  }

  return Backbone.View.extend({

    initialize: _initialize
    
  });
});