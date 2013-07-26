define([
  'text!template/venue.html',
  'text!template/spinner.html',
  'text!template/info.html',
  'view/checkinSummary',
  'model/venue'
], function (template, spinnerTemplate, infoTemplate, CheckinSummary, Venue) {
  'use strict';

  var _venue,
    _drawer,
    _fetch,
    _checkinPromise;

  function _refresh() {
    $('body[role="application"] section[role="region"] > header h1').last().html(_venue.get('name'));
    $('section div[role="main"]').last().html(_.template(template, _venue));
    $('button.recommend').on('click', _checkin);
  }

  function _initialize(venue, drawer) {
    _venue = venue;
    _drawer = drawer;
    _drawer.setWindow(_venue.get('name'));

    _venue.on('change', _refresh);
    _fetch = _venue.fetch();

    $('section header a').last().on('click', _remove);
  }

  function _checkin() {

    function _error(data){
      $('body > form').remove();
      $('body').append(_.template(infoTemplate, {
        message: 'Checkin in failed!',
        details: data.statusText,
        button1: 'Cancel',
        button2: 'Retry'
      }));
      $('button.button1').on('click', function(){
        $('body > form').remove();
      });
      $('button.button2').on('click', _checkin);
    }

    function _success(data){
      $('body > form').remove();

      if (typeof data === 'string') {
        //on Firefox OS data is string type
        data = JSON.parse(data);
      }

      //data = JSON.parse('{"meta":{"code":200,"errorType":"deprecated","errorDetail":"Please provide an API version to avoid future errors.See http:\/\/bit.ly\/vywCav"},"notifications":[{"type":"notificationTray","item":{"unreadCount":0}},{"type":"message","item":{"message":"OK! We\'ve got you @ red tower. You\'ve been here 2 times."}},{"type":"mayorship","item":{"type":"nochange","checkins":2,"user":{"id":"28641718","firstName":"Karolina","lastName":"J.","gender":"female","photo":"https:\/\/is0.4sqi.net\/userpix_thumbs\/2SNQGBROLBEEA5CI.jpg","tips":{"count":0},"lists":{"groups":[{"type":"created","count":2,"items":[]}]},"homeCity":"Łódź, Poland","bio":"","contact":{"facebook":"100001272047029"}},"message":"Karolina J. is mayor of red tower","image":"https:\/\/is0.4sqi.net\/userpix_thumbs\/2SNQGBROLBEEA5CI.jpg"}},{"type":"insights","item":{"insights":{"count":1,"items":[{"type":"pointsReward","image":"https:\/\/foursquare.com\/img\/points\/foursquare.png","title":"It\'s been 5 weeks since your last check-in. Welcome back to Foursquare!","shareable":false,"points":{"image":{"prefix":"https:\/\/foursquare.com\/img\/points\/foursquare_","sizes":[44,60,120],"name":".png"},"message":"It\'s been 5 weeks since your last check-in. Welcome back to Foursquare!","points":2}}]}}},{"type":"leaderboard","item":{"total":7,"scores":[{"icon":"https:\/\/foursquare.com\/img\/points\/foursquare.png","message":"It\'s been 5 weeks since your last check-in. Welcome back to Foursquare!","points":2},{"icon":"https:\/\/foursquare.com\/img\/points\/discovery-venue3.png","message":"First time at red tower.","points":5}],"leaderboard":[{"user":{"id":"3856202","firstName":"Marcin","lastName":"Klimowicz","gender":"male","relationship":"friend","photo":"https:\/\/is1.4sqi.net\/userpix_thumbs\/21BYWVSOJ5CJRRW5.jpg","tips":{"count":0},"lists":{"groups":[{"type":"created","count":1,"items":[]}]},"homeCity":"Łódź, Polska","bio":"","contact":{"email":"klimon44@gmail.com"}},"scores":{"recent":13,"max":123,"checkinsCount":2},"rank":8},{"user":{"id":"1614078","firstName":"Szaweł","lastName":"Precz","gender":"male","relationship":"self","photo":"https:\/\/is1.4sqi.net\/userpix_thumbs\/4U4WDLRRQGRCBBW1.jpg","tips":{"count":14},"lists":{"groups":[{"type":"created","count":2,"items":[]}]},"homeCity":"Łódź, Polska","bio":"","contact":{"phone":"600106185","email":"pawel.preczynski@gmail.com","twitter":"kric_pl","facebook":"1434678611"}},"scores":{"recent":7,"max":187,"checkinsCount":1},"rank":10},{"user":{"id":"40953614","firstName":"Piotr","lastName":"Wasilewski","gender":"male","relationship":"friend","photo":"https:\/\/is1.4sqi.net\/userpix_thumbs\/VCHQ5MWG4NPYCKOA.jpg","tips":{"count":0},"lists":{"groups":[{"type":"created","count":1,"items":[]}]},"homeCity":"Lódz","bio":"","contact":{"email":"piotr.wasilewski3@gmail.com","facebook":"100001534764235"}},"scores":{"recent":7,"max":43,"goal":50,"checkinsCount":1},"rank":10}],"message":"Nice! You just caught up with Piotr."}},{"type":"score","item":{"total":7,"scores":[{"icon":"https:\/\/foursquare.com\/img\/points\/foursquare.png","message":"It\'s been 5 weeks since your last check-in. Welcome back to Foursquare!","points":2},{"icon":"https:\/\/foursquare.com\/img\/points\/discovery-venue3.png","message":"First time at red tower.","points":5}]}}],"response":{"checkin":{"id":"51dfcc85498e23a080f3cb56","createdAt":1373621381,"type":"checkin","shout":"Nie ma mnie tu! - to tylko test!","timeZone":"Europe\/Warsaw","timeZoneOffset":120,"venue":{"id":"50503a7ee4b052774b774a6f","name":"red tower","contact":{},"location":{"address":"Piotrkowska 148\/150","lat":51.75954771267485,"lng":19.458937249909667,"city":"Łódź","country":"Poland","cc":"PL"},"canonicalUrl":"https:\/\/foursquare.com\/v\/red-tower\/50503a7ee4b052774b774a6f","categories":[{"id":"4bf58dd8d48988d130941735","name":"Building","pluralName":"Buildings","shortName":"Building","icon":"https:\/\/foursquare.com\/img\/categories\/building\/default.png","parents":["Professional & Other Places"],"primary":true}],"verified":false,"stats":{"checkinsCount":67,"usersCount":12,"tipCount":0},"likes":{"count":0,"groups":[]},"beenHere":{"count":0}},"likes":{"count":0,"groups":[]},"photos":{"count":0,"items":[]},"posts":{"count":0,"textCount":0},"comments":{"count":1,"items":[]}}}}');
      return new CheckinSummary(data.notifications, _drawer);
    }

    function _abort(){
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
    _checkinPromise = _venue.checkin(_success, _error);
    $('button.button1').on('click', _abort);
    
    //_success({});
  }

  function _remove(event) {
    event.preventDefault();
    $('section header a').last().off('click', _remove);
    $('button.recommend').off('click', _checkin);
    if (_fetch !== undefined &&
        typeof (_fetch.abort) === 'function') {
      _fetch.abort();
    }
    if (_checkinPromise !== undefined &&
        typeof (_checkinPromise.abort) === 'function') {
      _checkinPromise.abort();
    }
    _drawer.removeWindow();
  }

  return Backbone.View.extend({
    initialize: _initialize,
    remove:     _remove
  });
});