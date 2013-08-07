define([
  'text!template/spinner.html',
  'model/currentUser'
], function (template, CurrentUser) {
  'use strict';

  /**
    Method removes Logging from DOM and unbinds events.
    It now does nothing.

    @method _remove
    @for Logging
    @static
    @private
  */
  function _remove() {
    return;
  }

  /**
    Method is called when Logging object is initialised.

    @method _initialize
    @for Logging
    @static
    @private
  */
  function _initialize() {

    function _success() {
      //If there is action to go back go!
      //if (window.history.go(-2) === undefined) {
        //Else load default action
      Backbone.history.navigate('/', true);
      //}
    }

    function _error() {
      Backbone.history.navigate('/login', true);
    }

    $('body').html(_.template(template, {message: 'Logging in ...', button1: undefined, button2: undefined}));
    CurrentUser.auth(_success, _error);
  }

  /**
    Logging view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class Logging
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    /**
      Method is called when new Logging object is created. It points to {{#crossLink "Logging/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for Logging
      @constructor
    */
    initialize: _initialize,
    /**
      Method points to {{#crossLink "Logging/_remove"}}{{/crossLink}} method.

      @method remove
      @for Logging
    */
    remove:     _remove
  });
});
