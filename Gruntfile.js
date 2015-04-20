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
          src: ['assets/img/**'],
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
    },
    clean: ['dest'],
    csso: {
      dist: {
        options: {
          report: 'gzip'
        },
        files: {
          'dest/assets/cssconf-2015.css': ['dest/assets/cssconf-2015.css'],
          'dest/assets/fonts.css': ['dest/assets/fonts.css']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dest/assets/js/cssconf.js': ['dest/assets/js/cssconf.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('styles', [
    'sass',
    'autoprefixer'
  ]);

  grunt.registerTask('default', [
    'clean',
    'assemble',
    'sass',
    'autoprefixer',
    'copy',
    'browserify'
  ]);

  grunt.registerTask('build', [
    'default',
    'csso',
    'uglify'
  ]);

  grunt.registerTask('dev', [
    'default',
    'connect',
    'watch'
  ]);
};
