define([
  'text!template/recent.html',
  'text!template/checkin.html',
  'view/drawer',
  'collection/recent'
], function (template, checkinTemplate, Drawer, Recent) {
  'use strict';
  var _drawer,
    _recent,
    _fetch,
    _maxIndex,
    _remove,
    _add,
    _update;

  function _initialize() {
    _maxIndex = 0;
    _drawer = new Drawer(_remove);
    _drawer.setTitle('Recent checkins');
    _drawer.setContent(_.template(template));

    _recent = new Recent();
    _recent.on('add', _add);
    _fetch = _recent.fetch();

    $('.update').on('click', _update);
  }

  _update = function () {

    function _success() {
      $('p[role="status"]').hide('fast');
    }

    function _error() {
      var _text = $('p[role="status"] > span').text();
      $('p[role="status"] > span').text('Update failed!');
      $('p[role="status"]').hide('slow', function () {
        $('p[role="status"] > span').text(_text);
      });
    }

    $('div[role="main"]').scrollTop(0);
    $('p[role="status"]').show('fast', function () {
      if (_fetch !== undefined &&
          typeof (_fetch.abort) === 'function') {
        _fetch.abort();
      }
      _fetch = _recent.fetch({
        success: _success,
        error: _error
      });
    });
  };

  _add = function (checkin) {
    var _currentIndex = parseInt(checkin.get('createdAt'), 10);

    if (_maxIndex < _currentIndex) {
      _maxIndex = _currentIndex;
      $('.recent').prepend(_.template(checkinTemplate, checkin));
    } else {
      $('.recent').append(_.template(checkinTemplate, checkin));
    }
  };

  _remove = function () {
    if (_fetch !== undefined &&
        typeof (_fetch.abort) === 'function') {
      _fetch.abort();
    }
    _recent.off('add', _add);
  };

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});
