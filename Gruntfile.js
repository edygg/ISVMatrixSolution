module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      app: {
        files: 'frontend/**/*.js',
        tasks: ['concat'],
      },
      templates: {
        files: 'frontend/views/**/*.html',
        tasks: ['copy:templates'],
      },
      options: {
        interrupt: true,
      }
    },
    concat: {
      app: {
        src: ['frontend/app.module.js', 'frontend/app.config.js', 'frontend/controllers/*.js', 'frontend/directives/*,js', 'frontend/services/*.js'],
        dest: 'assets/js/app.js',
      },
    },
    copy: {
      templates: {
        expand: true,
        cwd: 'frontend/views',
        src: '**',
        dest: 'assets/templates/',
      },
      jslibraries: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/angular',
            src: 'angular.min.js',
            dest: 'assets/js/',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-animate',
            src: 'angular-animate.min.js',
            dest: 'assets/js/',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-aria',
            src: 'angular-aria.min.js',
            dest: 'assets/js/',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-messages',
            src: 'angular-messages.min.js',
            dest: 'assets/js/',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-material',
            src: 'angular-material.min.js',
            dest: 'assets/js/',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-ui-router/release',
            src: 'angular-ui-router.min.js',
            dest: 'assets/js/',
          },
        ],
      },
      csslibraries: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/angular-material',
            src: 'angular-material.min.css',
            dest: 'assets/css/',
          }
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'copy', 'watch']);
};
