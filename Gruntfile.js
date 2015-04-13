module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: { 'dest/assets/cssconf-2015.css': 'assets/styles/styles.scss' }
      }
    },
    autoprefixer: {
      dist: {
        options: {
          map: true
        },
        files: { 'dest/assets/cssconf-2015.css': 'dest/assets/cssconf-2015.css' }
      }
    },
    watch: {
      css: {
        files: 'assets/styles/*.scss',
        tasks: ['styles']
      },
      html: {
        files: 'templates/**/*.hbs',
        tasks: ['assemble']
      }
    },
    assemble: {
      options: {
        flatten: true,
        partials: ['templates/partials/*.hbs'],
        layoutdir: 'templates/layouts',
        layout: 'default.hbs'
      },
      site: {
        files: { 'dest/': ['templates/*.hbs'] }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          src: ['assets/img/**', 'assets/js/**'],
          dest: 'dest/'
        }]
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: 'dest'
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('styles', ['sass', 'autoprefixer']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['assemble', 'sass', 'autoprefixer', 'copy']);
  grunt.registerTask('dev', ['build', 'connect', 'watch']);
};
