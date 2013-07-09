module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');

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
    },
    requirejs: {
      compile: {
        options: {
          name:           "app",
          baseUrl:        "src/js",
          mainConfigFile: "src/js/app.js",
          out:            "dist/<%= pkg.version %>/js/app.js"
        }
      }
    },
    copy: {
      'default': {
        files: [
          {
            expand: true,
            src: [
              'index.html',
              'manifest.webapp',
              'css/**',
              'ico/**',
              'components/**'
            ],
            cwd: 'src/',
            dest: 'dist/<%= pkg.version %>'
          }
        ]
      }
    },
    compress: {
      'default': {
        options: {
          archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: 'dist/<%= pkg.version %>/',
        src: ['**'],
        dest: ''
      }
    }
  });

  grunt.registerTask('default', 'Default build',
    [
      'jslint',
      'requirejs',
      'copy',
      'compress'
    ]);

// grunt.registerTask('default', 'Default build', function(){
//   grunt.log.write(grunt.config.get('pkg.name')).ok();
// });
};
