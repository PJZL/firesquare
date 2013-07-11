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
    _remove,
    _add,
    _update;

  function _initialize() {
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

    //check before each element should be put new element.
    $('.recent li').each(function() {
      if ($('.recent li[created-at="10"]').get(0) === undefined &&
          parseInt($(this).attr('created-at'), 10) < parseInt(checkin.get('createdAt'), 10)) {
        $(this).before(_.template(checkinTemplate, checkin));
        return;
      }
    });

    //if element is not yet in DOM it should be put at the end of the list
    if ($('.recent li[created-at="10"]').get(0) === undefined) {
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
