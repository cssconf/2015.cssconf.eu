var babelify = require('babelify');

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            babelify.configure({
              // allow ES7 features
              stage: 0
            })
          ]
        },
        files: {
          'dest/assets/js/cssconf.js': ['assets/js/cssconf.js']
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dest/assets/fonts.css': 'assets/styles/fonts.scss',
          'dest/assets/cssconf-2015.css': 'assets/styles/styles.scss'
        }
      }
    },
    autoprefixer: {
      dist: {
        options: {
          map: true
        },
        files: {
          'dest/assets/cssconf-2015.css': 'dest/assets/cssconf-2015.css',
          'dest/assets/fonts.css': 'dest/assets/fonts.css'
        }
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
      },
      js: {
        files: 'assets/js/**/*.js',
        tasks: ['browserify']
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
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('styles', ['sass', 'autoprefixer']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['assemble', 'sass', 'autoprefixer', 'copy', 'browserify']);
  grunt.registerTask('dev', ['build', 'connect', 'watch']);
};
