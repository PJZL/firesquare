define([
  'text!template/recent.html',
  'text!template/checkin.html',
  'view/drawer',
  'collection/recent'
], function (template, checkinTemplate, Drawer, Recent){

  var _drawer,
    _recent,
    _fetch;

  function _initialize () {
    _drawer = new Drawer(_remove);
    _drawer.setTitle('Recent checkins');
    _drawer.setContent(_.template(template));

    recent = new Recent();
    recent.on('add', _add);
    _fetch = recent.fetch();
  }

  function _add(checkin) {
    $('.recent').append(_.template(checkinTemplate, checkin));
  }

  function _remove () {
    if (_fetch !== undefined &&
        typeof(_fetch.abort) === 'function' ) {
      _fetch.abort();
    }
    recent.off('add', add);
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});
