module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['component.js','component.css','partials/*'],
        tasks: ['html2js','cssmin','css2js','uglify']
      }
    },
    html2js: {
      options: {
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          },
          base: './partials',
          module: '<%= pkg.name %>-templates',
          singleModule: true

      },
      main: {
        src: ['partials/*.html'],
        dest: 'templates.js'
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false
      },
      min: {
        files: {
          "component.min.js": [
            "templates.js",
            "component.js",
            'component.min.css.js'
          ]
        }
      }
    },
    css2js: {
        compile: {
            src: 'component.min.css',
            dest: 'component.min.css.js'
        }
    },
    cssmin : {
      options: {
        report: 'gzip'
      },
      combine : {
        files: {
          "component.min.css": [
            'component.css'
          ]
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-css2js');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['html2js','cssmin','css2js','uglify']);
};
