module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jslint: {
      files: [
        'src/js/*.js'
      ],
      directives: {
        indent: 2,
        todo: true,
        nomen: true,
        predef: [
          'jQuery'
        ]
      }
    }

  });

  grunt.registerTask('default', 'Default build', ['jslint']);
};
