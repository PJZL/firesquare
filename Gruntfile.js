module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-jslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('src/manifest.webapp'),
    jslint: {
      files: [
        'src/js/**/*.js',
        '*.js'
      ],
      exclude: [
        'src/js/lib/text.js'
      ],
      directives: {
        indent: 2,
        todo: true,
        nomen: true,
        predef: [
          '_',
          '$',
          'window',
          'require',
          'define',
          'Backbone',
          'module',
          '__dirname',
          'document'
        ]
      }
    }

  });

  grunt.registerTask('default', 'Default build', ['jslint']);
// grunt.registerTask('default', 'Default build', function(){
//   grunt.log.write(grunt.config.get('pkg.name')).ok();
// });
};
