const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts').default;


module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      dist: ['dist']
    },

    rollup: {
      unminified: {
        options: {
          plugins: () => [
            require('@rollup/plugin-node-resolve').nodeResolve({ browser: true }),
            require('@rollup/plugin-commonjs')(),
            typescript({ tsconfig: './tsconfig.json' })
          ],
          external: ['video.js'],
          output: {
            format: 'iife',
            name: 'VideoJSThemePlugin',
            globals: {
              'video.js': 'videojs'
            }
          }
        },
        files: {
          'dist/videojs-skin.js': 'src/ts/videojs-skin.ts'
        }
      },
      minified: {
        options: {
          plugins: () => [
            require('@rollup/plugin-node-resolve').nodeResolve({ browser: true }),
            require('@rollup/plugin-commonjs')(),
            typescript({ tsconfig: './tsconfig.json',  noEmitOnError: false }),
            terser(),
          ],
          external: ['video.js'],
          output: {
            format: 'iife',
            name: 'VideoJSThemePlugin',
            globals: {
              'video.js': 'videojs'
            }
          }
        },
        files: {
          'dist/videojs-skin.min.js': 'src/ts/videojs-skin.ts'
        }
      },
      dts: {
        options: {
          plugins: () => [dts()],
          output: {
            format: 'es'
          }
        },
        files: {
          'dist/videojs-skin.d.ts': 'src/ts/types/index.ts'
        }
      }
    },

    sass: {
      dist: {
        options: {
          implementation: require('sass'),
          outputStyle: 'compressed'
        },
        files: {
          'dist/videojs-skin.css': 'src/scss/videojs-skin.scss'
        }
      }
    },
    concat: {
      index: {
          options: {
              banner: 'import "./style.css";\n', // Add CSS import at the top
              footer: '\nexport { default } from "./videojs-skin.min.js";' // Add JS export at the bottom
          },
          src: [], // No need for actual content, just headers & footers
          dest: 'dist/index.js'
      }
    },
    copy: {
      direct_files: { // Add this section
        files: [
          {
            src: 'README.md',
            dest: 'dist/README.md'
          },
          {
            src: 'package.json', // Copy package.json
            dest: 'dist/package.json'
          },
          {
            src: 'LICENSE.md', // Copy package.json
            dest: 'dist/LICENSE.md'
          }
        ]
      }
    },
  });
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['clean', 'rollup:unminified', 'concat','rollup:minified','rollup:dts', 'sass','copy:direct_files']);
};
