var gulp = require('gulp');
var concat = require('gulp-concat');
var closure = require('gulp-closure-compiler-service');
var rename = require("gulp-rename");

var sources = [
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

gulp.task('rot.js', function () {
    return gulp.src(sources)
        .pipe(concat('rot.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('rot.min.js', ['rot.js'], function () {
    return gulp.src(['rot.js'])
        .pipe(rename('rot.min.js'))
        .pipe(closure({
            //compilation_level: 'SIMPLE_OPTIMIZATIONS'
        //    output_format: 'text',
        //    output_info: 'compiled_code',
            charset: 'utf-8'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['rot.min.js'], function(){});

