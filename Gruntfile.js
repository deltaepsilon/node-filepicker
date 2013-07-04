module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          ui: 'tdd',
          timeout: 60000
        },
        src: ['test/*.js']
      }
    },
    watch: {
      src: {
        files: ['test/*', 'lib/*', 'index.js'],
        tasks: ['mochaTest'],
        option: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', ['mochaTest']);
  grunt.registerTask('test', ['mochaTest']);
}