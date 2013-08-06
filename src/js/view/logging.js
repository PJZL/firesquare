define([
  'text!template/spinner.html',
  'model/self',
  'model/service'
], function (template, Self, Service) {
  'use strict';

  /**
    Method removes Venue from DOM and unbinds events.

    @method _remove
    @for Venue
    @param {Object} event
    @static
    @private
  */
  function _remove() {
    return;
  }

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

  /**
    Method is called when Venue object is initialised.

    @method _initialize
    @for Venue
    @static
    @private
  */
  function _initialize() {
    $('body').html(_.template(template, {message: 'Logging in ...', button1: undefined, button2: undefined}));
    Self.auth(_success, _error);
  }

  /**
    Venue view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class Venue
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    /**
      Method is called when new SearchVenue object is created. It points to {{#crossLink "SearchVenue/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for SearchVenue
      @constructor
    */
    initialize: _initialize,
    /**
      Method points to {{#crossLink "SearchVenue/_remove"}}{{/crossLink}} method.

      @method remove
      @for SearchVenue
    */
    remove:     _remove
  });
});
