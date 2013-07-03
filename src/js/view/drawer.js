define([
  'text!template/drawer.html',
  'text!template/spinner.html',
  'model/self'
], function (template, spinnerTemplate, self){
  var _isLoaded = false;

  function _initialize(){
    if (!_isLoaded) {
      _isLoaded = true;
      $('body').html(_.template(template, self));
      $('body > section > header > a').on('click', _showHideMenu);
    }
  }

  function _showHideMenu() {
    var region = document.querySelector("body > section");

    if ( region.getAttribute("data-state") == "drawer" ) {
      region.setAttribute("data-state", "none");
    } else {
      region.setAttribute("data-state", "drawer");
    }
  }

  function _remove(){
    if (_isLoaded) {
      _isLoaded = false;
      $('body').html(_.template(spinnerTemplate));
    }
  }

  return Backbone.View.extend({
    initialize: _initialize
  });
});