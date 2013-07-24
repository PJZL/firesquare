require.config({
  paths: {
    text: '../src/js/lib/text',
    template: '../src/template',
    view: '../src/js/view',
    model: '../src/js/model',
    collection: '../src/js/collection',
    tests: '.'
  }
});

require([
  'tests/collection/recent'
], function (recent) {
  'use strict';

  recent.run();
  QUnit.start();
});
