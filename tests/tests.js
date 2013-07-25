require.config({
  paths: {
    text: '../src/js/lib/text',
    template: '../src/template',
    view: '../src/js/view',
    model: '../src/js/model',
    collection: '../src/js/collection',
    tests: '.',
    mock: './mock'
  }
});

require([
  'tests/collection/recent',
  'tests/model/self'
], function () {
  'use strict';

  QUnit.start();
});
