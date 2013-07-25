![icon](/src/ico/128.png) FireSquare [![Build Status](https://travis-ci.org/PJZL/firesquare.png?branch=master)](https://travis-ci.org/PJZL/firesquare)
====================================

Foursquare client for Firefox OS.
---------------------------------
The aim of this project is to provide basic [foursquare](http://foursquare.com) client application for [Firefox OS](http://www.mozilla.org/en-US/firefox/os/).

Building project:
-----------------------
* Install [nodejs and NPM](http://nodejs.org/download).
* Install dependencies `npm install`.
* Install Grunt `sudo npm install grunt-cli -g`.
* Run grunt default task `grunt`.

Generating documentation:
--------------------------
* Install [nodejs and NPM](http://nodejs.org/download).
* Install [Yuidoc](http://yui.github.io/yuidoc/) `sudo npm install yuidoc -g`.
* Run Yuidoc `yuidoc`.

Used libraries:
---------------
* [underscore.js](http://underscorejs.org/).
* [backbone.js](http://backbonejs.org/).
* [require.js](http://requirejs.org/) for modular architecture.
* [jquery](http://jquery.com/).
* [qunit](http://qunitjs.com/) for unit tests.
* [jquery-mockjax](http://github.com/appendto/jquery-mockjax) for mocking or simulating ajax requests and responses.
* [Gaia UI Building Blocks](http://github.com/mozilla-b2g/Gaia-UI-Building-Blocks).

Build system:
-------------
* [Grunt](http://gruntjs.com/)
with plugins:
* [grunt-jslint](https://github.com/stephenmathieson/grunt-jslint) to keep code quality.
* [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs) for optimizing requirejs projects.
* [grunt-contrib-copy](http://github.com/gruntjs/grunt-contrib-copy)
* [grunt-contrib-compress](http://github.com/gruntjs/grunt-contrib-compress)
* [grunt-contrib-clean](http://github.com/gruntjs/grunt-contrib-clean)
* [grunt-contrib-qunit](http://github.com/gruntjs/grunt-contrib-qunit) for automated unit tests using [PhantomJS]().
* [grunt-bg-shell](http://github.com/rma4ok/grunt-bg-shell)
* [expressjs](http://expressjs.com/) for standalone web server.
* [bower](http://bower.io/) for managing used libraries.

Continuous integration
----------------------
* [travis-ci](http://travis-ci.org)

Licence:
----------------------
Product is distributed under the [MIT License](LICENSE).
