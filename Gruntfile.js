module.exports = function (grunt) {
  'use strict';

  var paths = {
    sourceBase   : './',
    buildBase    : 'build/',
    sourceAssets : 'assets',
    buildAssets  : 'build/assets'
  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON( './package.json' ),
    paths : paths,
    // Start a local server
    connect: {
      dev: {
        options: {
          port: 8000,
          base: paths.buildBase,
          open: true,
        }
      }
    },
    // Lint JS files for coventions
    jscs: {
      src : '<%= paths.sourceAssets %>/js/source/*.js',
      options : {
        config : '.jscsrc',
        fix    : true
      }
    },
    // Lint JS files
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc : true,
      },
      src : ['<%= paths.sourceAssets %>/js/source/*.js']
    },
    // Compiling javascript
    uglify: {
      options: {
        mangle: false,
        sourceMapIncludeSources : true,
        compress : {
          dead_code : true,
          drop_debugger : true,
          unused : true,
          join_vars : true,
          warnings : true,
          drop_console: true
        }
      },
      libs: {
        files : [{
          expand: true,
          cwd: '<%= paths.sourceAssets %>/js/libs',
          src: '**/*.js',
          dest: '<%= paths.buildAssets %>/js/libs'
        }]
      },
      pages: {
        files : [{
          expand: true,
          cwd: '<%= paths.sourceAssets %>/js/src',
          src: '**/*.js',
          dest: '<%= paths.buildAssets %>/js/src'
        }]
      }
    },
    // Lint SCSS files
    scsslint: {
      allFiles: ['<%= paths.sourceAssets %>/sass/**/*.scss', '!<%= paths.sourceAssets %>/sass/vendor/**/*.scss'],
      options: {
        config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      },
    },
    // SASS compiling
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '<%= paths.buildAssets %>/css/main.css': '<%= paths.sourceAssets %>/sass/main.scss'
        }
      }
    },
    // Purify CSS
    purifycss: {
      options: {
        minify: true,
        info: true,
        rejected: true
      },
      target: {
        src: ['<%= paths.buildBase %>/**/*.html', '<%= paths.buildAssets %>/**/*.js'],
        css: ['<%= paths.buildAssets %>/css/**/main.css'],
        dest: '<%= paths.buildAssets %>/css/dennis.css'
      },
    },
    // CSS minification
    postcss: {
      options: {
        map: 'inline', // inline sourcemaps
        processors: [
          require('cssnano')({
            autoprefixer : {
            }
          })
        ]
      },
      dist: {
        src: '<%= paths.buildAssets %>/css/main.css'
      }
    },
    // The ever epic watch statement
    watch: {
      options: {
        livereload: true,
      },
      html : {
        files: '<%= paths.sourceBase %>/*.html',
        tasks: ['copy:html'],
      },
      templates : {
        files: '<%= paths.sourceAssets %>/templates/*.html',
        tasks: ['copy:templates'],
      },
      js: {
        files: '<%= paths.sourceAssets %>/js/**/*.js',
        tasks: ['uglify'],
      },
      css: {
        files: '<%= paths.sourceAssets %>/sass/**/*.scss',
        tasks: ['sass', 'postcss'],
      },
      images : {
        files : '<%= paths.sourceAssets %>/images/**/*',
        tasks : ['copy:images']
      },
      fonts : {
        files : '<%= paths.sourceAssets %>/fonts/**/*',
        tasks : ['copy:fonts']
      },
      grunt: {
          files: ['Gruntfile.js']
      }
    },
    copy: {
      html : {
        files: [{
            expand: true,
            flatten: true,
            src: ['<%= paths.sourceBase %>/*.html'],
            dest: '<%= paths.buildBase %>',
            filter: 'isFile'
          },
        ]
      },
      templates : {
        files: [{
            expand: true,
            flatten: true,
            src: ['<%= paths.sourceAssets %>/templates/**/*.html'],
            dest: '<%= paths.buildAssets %>/templates',
            filter: 'isFile'
          },
        ]
      },
      images: {
        files: [{
            expand: true,
            flatten: true,
            src: ['<%= paths.sourceAssets %>/images/**/*.{jpeg,jpg,png,gif}'],
            dest: '<%= paths.buildAssets %>/images',
            filter: 'isFile'
          },
        ]
      },
      fonts: {
        files: [{
            expand: true,
            flatten: true,
            src: ['<%= paths.sourceAssets %>/fonts/**/*'],
            dest: '<%= paths.buildAssets %>/fonts',
            filter: 'isFile'
          },
        ]
      }
    },
    // Push the built files to the gh-pages branch
    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'gh-pages'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('assemble');

  /* grunt tasks */
  grunt.registerTask('default', ['sass', 'postcss', 'copy', 'uglify', 'connect', 'watch' ]);

  // Build task
  grunt.registerTask('build', ['assemble', 'sass', 'postcss', 'purifycss', 'gh-pages' ]);

};
