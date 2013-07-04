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

    _recent = new Recent();
    _recent.on('add', _add);
    _fetch = _recent.fetch();

    $('.update').on('click', _update);
  }

  function _update(){

    function _success(){
      $('p[role="status"]').hide('fast');
    }

    function _error(){
      var _text = $('p[role="status"] > span').text();
      $('p[role="status"] > span').text('Update failed!');
      $('p[role="status"]').hide('slow', function(){
         $('p[role="status"] > span').text(_text);
      });
    }

    $('div[role="main"]').scrollTop(0);
    $('p[role="status"]').show('fast', function(){
      if (_fetch !== undefined &&
          typeof(_fetch.abort) === 'function' ) {
        _fetch.abort();
      }
      _fetch = _recent.fetch({
        success: _success,
        error: _error
      });
    });
    
  }

  function _add(checkin) {
    if (_recent.models.length > 0 &&
        parseInt(checkin.get('createdAt'), 10) < parseInt(_recent.models[_recent.models.length-1].get('createdAt'), 10)) {
      $('.recent').prepend(_.template(checkinTemplate, checkin));
    } else {
      $('.recent').append(_.template(checkinTemplate, checkin));
    }
  }

  function _remove () {
    if (_fetch !== undefined &&
        typeof(_fetch.abort) === 'function' ) {
      _fetch.abort();
    }
    _recent.off('add', _add);
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});
