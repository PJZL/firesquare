define([
  'text!template/drawer.html',
  'text!template/spinner.html',
  'model/self'
], function (template, spinnerTemplate, self) {
  'use strict';

  var _isLoaded = false,
    _currentRemove,
    _drawer,
    _unloadView;

  /**
    Method is called when Drawer object is initialised, but DOM drawer is initialised only once.

    @method _initialize
    @for Drawer
    @param {function} remove function that is called when current view is unloaded.
    @static
    @private
  */
  function _initialize(remove) {
    if (!_isLoaded) {
      _isLoaded = true;
      $('body').html(_.template(template, self));
      $('body > section > header > a').on('click', _drawer);
    }

    _unloadView(remove);
  }

  /**
    Method unloads current view by calling `_remove` function when set. After unloading old view, new `_remove` function is set.

    @method _unloadView
    @for Drawer
    @param {function} remove function that is called when current view is unloaded.
    @static
    @private
  */
  _unloadView = function(remove) {
    if (_currentRemove !== undefined &&
        typeof _currentRemove === 'function') {
      _currentRemove();
    }
    _currentRemove = remove;
  };

  /**
    Method manages visibilty of left menu. When menu is visible it will be hidden. If menu is hidden it will became visible. If `hide` parameted is true menu will stay hidden.

    @method _drawer
    @for Drawer
    @param {boolean} hide when set, menu will remain hidden.
    @static
    @private
  */
  _drawer = function(hide) {

    var region = document.querySelector("body > section");

    if (region.dataset.state === 'drawer') {
      region.dataset.state = 'none';
    } else if (true !== hide) {
      region.dataset.state = 'drawer';
    }
    return false;
  };

  /**
    Method removes drower from DOM and shows spinner.

    @method _remove
    @for Drawer
    @static
    @private
  */
  function _remove() {
    if (_isLoaded) {
      _isLoaded = false;
      $('body').html(_.template(spinnerTemplate));
    }
  }

  /**
    Method sets title for header.

    @method _setTitle
    @for Drawer
    @param {String} title
    @static
    @private
  */
  function _setTitle(title) {
    $('body[role="application"] section[role="region"] > header h1').html(title);
  }

  /**
    Method sets content.

    @method _setContent
    @for Drawer
    @param {String} content
    @static
    @private
  */
  function _setContent(content) {
    $('div[role="main"]').html(content);
  }

  /**
    Drawer view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class Drawer
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    /**
      Method is called when new Drawer object is created. It points to {{#crossLink "Drawer/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for Drawer
      @constructor
    */
    initialize: _initialize,
    /**
      Method points to {{#crossLink "Drawer/_setTitle"}}{{/crossLink}} method.

      @method setTitle
      @for Drawer
    */
    setTitle: _setTitle,
    /**
      Method points to {{#crossLink "Drawer/_setContent"}}{{/crossLink}} method.

      @method setContent
      @for Drawer
    */
    setContent: _setContent,
    /**
      Method points to {{#crossLink "Drawer/_remove"}}{{/crossLink}} method.

      @method remove
      @for Drawer
    */
    remove: _remove
  });
});