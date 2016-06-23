'use strict';
const fs = require('fs');
const gulp = require('gulp');
const concat = require('gulp-concat');
const closure = require('gulp-closure-compiler-service');
const rename = require("gulp-rename");
const insert = require("gulp-insert");
const jsdoc = require('gulp-jsdoc3');
const del = require('del');

const version = fs.readFileSync('VERSION', 'utf-8').trim();
const sources = [
  'src/rot.js',
  'src/text.js',
  'src/js/array.js',
  'src/js/number.js',
  'src/js/string.js',
  'src/js/object.js',
  'src/js/function.js',
  'src/js/raf.js',
  'src/display/display.js',
  'src/display/backend.js',
  'src/display/rect.js',
  'src/display/hex.js',
  'src/display/tile.js',
  'src/rng.js',
  'src/stringgenerator.js',
  'src/eventqueue.js',
  'src/scheduler/scheduler.js',
  'src/scheduler/scheduler-simple.js',
  'src/scheduler/scheduler-speed.js',
  'src/scheduler/scheduler-action.js',
  'src/engine.js',
  'src/map/map.js',
  'src/map/arena.js',
  'src/map/dividedmaze.js',
  'src/map/iceymaze.js',
  'src/map/ellermaze.js',
  'src/map/cellular.js',
  'src/map/dungeon.js',
  'src/map/digger.js',
  'src/map/uniform.js',
  'src/map/rogue.js',
  'src/map/features.js',
  'src/noise/noise.js',
  'src/noise/simplex.js',
  'src/fov/fov.js',
  'src/fov/discrete-shadowcasting.js',
  'src/fov/precise-shadowcasting.js',
  'src/fov/recursive-shadowcasting.js',
  'src/color.js',
  'src/lighting.js',
  'src/path/path.js',
  'src/path/dijkstra.js',
  'src/path/astar.js'
];

const nodeVersion = fs.readFileSync('NODE_VERSION', 'utf-8').trim();
const nodePreSources = ['node/node-shim.js'];
const nodePostSources = [
  'node/term.js',
  'node/term-color.js',
  'node/xterm-color.js',
  'node/node-export.js',
];

gulp.task('default', ['rot.min.js', 'node']);

gulp.task('rot.js', function () {
  console.log(`Current rot.js version is ${version}`);
  return gulp.src(sources)
    .pipe(insert.transform(contents=> contents.replace(/(\r\n|\n)$/g, '')))
    .pipe(concat('rot.js'))
    .pipe(insert.prepend('/*\n' +
      '\tThis is rot.js, the ROguelike Toolkit in JavaScript.\n' +
      `\tVersion ${version}, generated on ${getShellStyleDate()}.\n` +
      '*/\n'))
    .pipe(gulp.dest('.'));

  function getShellStyleDate() {
    return new Date().toString().replace(/(.+?)(\d\d\d\d).*?(\d\d:\d\d:\d\d).*\((.).+?\s(.).+?\s(.).*/, '$1$3 $4$5$6 $2');
  }
});

gulp.task('rot.min.js', ['rot.js'], function () {
  console.log(`Calling closure compiler's REST API, this might take a while`);
  return gulp.src(['rot.js'])
    .pipe(rename('rot.min.js'))
    .pipe(closure({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      output_format: 'text',
      output_info: 'compiled_code',
      charset: 'utf-8'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('node', ['package.json', 'rot.js.node', 'misc-node-files']);

gulp.task('misc-node-files', function () {
  return gulp.src(['license.txt', 'node/README.md'])
    .pipe(gulp.dest('node-deploy'));
});

gulp.task('package.json', function (done) {
  console.log('Creating package.json for Node.js');
  return gulp.src(['node/package.node'])
    .pipe(insert.prepend(`{\n\t"name": "rot-js",\n\t"version": "${nodeVersion}",`))
    .pipe(gulp.dest('node-deploy'));
});

gulp.task('rot.js.node', function () {
  console.log(`Current rot.js version is ${version}`);
  console.log(`Current rot.js version for Node.js is ${nodeVersion}`);
  return gulp.src([...nodePreSources, ...sources, ...nodePostSources])
    .pipe(insert.transform(contents=> contents.replace(/(\r\n|\n)$/g, '')))
    .pipe(concat('rot.js'))
    .pipe(insert.prepend('/*\n' +
      '\tThis is rot.js, the ROguelike Toolkit in JavaScript.\n' +
      `\tVersion ${version}, generated on ${getShellStyleDate()}.\n` +
      '*/\n'))
    .pipe(gulp.dest('node-deploy/lib'));

  function getShellStyleDate() {
    return new Date().toString().replace(/(.+?)(\d\d\d\d).*?(\d\d:\d\d:\d\d).*\((.).+?\s(.).+?\s(.).*/, '$1$3 $4$5$6 $2');
  }
});

gulp.task('doc', function (cb) {
  console.log('Calling jsdoc to auto-generate documentation');
  const config = {
    opts: {
      destination: './doc/'
    }
  };
  gulp.src(['rot.js'], {read: false})
    .pipe(jsdoc(config, cb));
});

gulp.task('clean', function (cb) {
  console.log('Removing generated JS files');
  return del([
    'rot.js',
    'rot.min.js',
    'node-deploy'
  ]);
});
