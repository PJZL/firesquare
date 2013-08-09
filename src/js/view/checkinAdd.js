define([
  'text!template/checkinAdd.html',
  'text!template/spinner.html',
  'model/checkin',
  'model/venue',
  'view/checkinSummary'
  ], function(template, spinnerTemplate, Checkin, Venue, CheckinSummary) {

    var _venue,
        _drawer,
        _checkinPromise;

    /**
     * Method updates checkin adding view.

       @method _refresh
       @for CheckinAdd
       @static
       @private
     */
    function _refresh() {
        $('body[role="application"] section[role="region"] > header h1').last().html(_venue.get('name'));
        $('section div[role="main"]').last().html(_.template(template, _venue));
        $('button.recommend').on('click', _checkin);
    }

    /**
       Method unbinds events from the view

       @method _remove
       @for CheckinAdd
       @static
       @private
     */
    function _remove() {
      $('button.recommend').off('click', _checkin);
      $('section header a').last().off('click', _drawer.removeWindow);
      if (_checkinPromise !== undefined &&
          typeof (_checkinPromise.abort) === 'function') {
        _checkinPromise.abort();
      }
    }

    /**
     * Method initializes the view

       @method _initialize
       @for CheckinAdd
       @param {Object} Venue Object
       @param {Object} Drawer Object
       @static
       @private
     */
    function _initialize(venue, drawer) {
      _venue = venue;
      _drawer = drawer;
      _drawer.setWindow(_venue.get('name'), _remove);
      $('section header a').last().on('click', _drawer.removeWindow);

      _refresh();
    }

    /**
      Method modifies the view to do a checkin and performs it

       @method _checkin
       @for CheckinAdd
       @static
       @private
     */
    function _checkin() {

      function _error(data) {
          $('body > form').remove();
          $('body').append(_.template(infoTemplate, {
            message: 'Checkin in failed!',
            details: data.statusText,
            button1: 'Cancel',
            button2: 'Retry'
          }));
          $('button.button1').on('click', function() {
            $('body > form').remove();
          });
          $('button.button2').on('click', _checkin);
        }

        function _success(data) {
          $('body > form').remove();

          if (typeof data === 'string') {
            //on Firefox OS data is string type
            data = JSON.parse(data);
          }

          return new CheckinSummary(data.notifications, _drawer);
        }

        function _abort() {
          _checkinPromise.abort();
          $('body > form').remove();
        }

        if (_checkinPromise !== undefined &&
            typeof (_checkinPromise.abort) === 'function') {
          _checkinPromise.abort();
        }

        $('body').append(_.template(spinnerTemplate, {
          message: 'Checking in ...',
          button1: 'Cancel',
          button2: undefined
        }));

        var media = [];
        $('.share:checked').each(function(i,o) {
            media.push($(o).data('media'));
        });

        _checkinPromise = _venue.checkin({success: _success, error: _error, shout: $('#checkin-shout').val(), broadcast: media.join()});
        $('button.button1').on('click', _abort);
  }

  /**
    CheckinAdd view that is extension of [Backbone.View](http://backbonejs.org/#View).

    @class CheckinAdd
    @namespace View
    @extends Backbone.View
  */
  return Backbone.View.extend({
    /**
      Method is called when new CheckinAdd object is created. It points to {{#crossLink "CheckinAdd/_initialize"}}{{/crossLink}} method.

      @method initialize
      @for CheckinAdd
      @constructor
    */
    initialize: _initialize,

    /**
      Method is called when CheckinAdd view is removed from windows stack. It points to {{#crossLink "CheckinAdd/_remove"}}{{/crossLink}} method.

      @method remove
      @for CheckinAdd
      @constructor
    */
    remove: _remove
  });

});