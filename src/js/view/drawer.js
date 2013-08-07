define([
  'text!template/drawer.html',
  'text!template/drawerWindow.html',
  'model/currentUser'
], function (template, drawerWindowTemplate, CurrentUser) {
  'use strict';

  var _isLoaded = false,
    _currentRemove,
    _currentUpdate,
    _drawer,
    _unloadView,
    _windowStack = [],
    _removeAllWindow;

  /**
    Method is called when Drawer object is initialized, but DOM drawer is initialized only once.

    @method _initialize
    @for Drawer
    @param {function} remove function that is called when current view is unloaded.
    @param {function} update function that is called when current view needs to be updated.
    @static
    @private
  */
  function _initialize(remove, update) {
    if (!_isLoaded) {
      _isLoaded = true;
      $('body').html(_.template(template, CurrentUser));
      $('body > section > header > a').on('click', _drawer);
    }

    _unloadView(remove, update);
    //Hide drawer.
    _drawer(true);
  }

  /**
    Method unloads current view by calling `_remove` function when set. After unloading old view, new `_remove` function is set.

    @method _unloadView
    @for Drawer
    @param {function} remove function that is called when current view is unloaded.
    @param {function} update function that is called when current view needs to be updated.
    @static
    @private
  */
  _unloadView = function(remove, update) {
    _removeAllWindow();
    if (_currentRemove !== undefined &&
        typeof _currentRemove === 'function') {
      _currentRemove();
    }
    _currentRemove = remove;
    _currentUpdate = update;
  };

  /**
    Method manages visibility of left menu. When menu is visible it will be hidden.
    If menu is hidden it will became visible. If `hide` parameter is true menu will stay hidden.

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
    Method removes all windows, views from DOM, unloads events.

    @method _remove
    @for Drawer
    @static
    @private
  */
  function _remove() {
    if (_isLoaded) {
      _isLoaded = false;
      _removeAllWindow();
      _unloadView();
      $('body > section > header > a').off('click', _drawer);
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
    $('section div[role="main"]').first().html(content);
  }

  /**
    Method sets new window with title and spinner.

    @method _setWindow
    @for Drawer
    @param {String} title
    @param {function} remove that is called when window is removed.
    @static
    @private
  */
  function _setWindow(title, remove) {
    $('body').append(_.template(drawerWindowTemplate, {title: title}));
    $('section[role="region"]').last().removeAttr('data-state');
    _windowStack.push(remove);
  }

  /**
    Method removes current window.

    @method _removeWindow
    @for Drawer
    @param {Object} event when function is called by user action.
    @param {function} callback
    @static
    @private
  */
  function _removeWindow(event, callback) {
    if (event !== undefined) {
      event.preventDefault();
    }
    /*
      TODO: add windows animations
      $('section[role="region"]').last().attr('data-state', 'right');
    */
    if (_windowStack.length > 0) {
      _windowStack.pop()();
      $('section[role="region"]').last().remove();
    }
    if (typeof callback === 'function') {
      callback();
    }
  }

  /**
    Method removes all windows. Calls `update` on current view is available.

    @method _removeAllWindow
    @for Drawer
    @param {Object} event when function is called by user action.
    @static
    @private
  */
  _removeAllWindow = function(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    _removeWindow(undefined, function() {
      if ($('section[role="region"][drawer=window]').length > 0) {
        _removeAllWindow();
      } else if (typeof _currentUpdate === 'function') {
        _currentUpdate();
      }
    });
  };

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
    remove: _remove,
    /**
      Method points to {{#crossLink "Drawer/_setWindow"}}{{/crossLink}} method.

      @method setWindow
      @for Drawer
    */
    setWindow: _setWindow,
    /**
      Method points to {{#crossLink "Drawer/_removeWindow"}}{{/crossLink}} method.

      @method removeWindow
      @for Drawer
    */
    removeWindow: _removeWindow,
    /**
      Method points to {{#crossLink "Drawer/_removeAllWindow"}}{{/crossLink}} method.

      @method removeAllWindow
      @for Drawer
    */
    removeAllWindow: _removeAllWindow
  });
});