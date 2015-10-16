'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var path = require('path');
var exec = require('child_process').exec;
var sourcemaps = require('gulp-sourcemaps');
var compass = require('gulp-for-compass');
var uglify = require('gulp-uglify');

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var tsConfig = require('./tsconfig.json');
var tsSource = tsConfig.filesGlob;

gulp.task('clean', function (callback) {
    del(['js/**/*.js'], function (error) {
        if (error) {
            return callback(error);
        }
        callback();
    });
});

gulp.task('compass', function () {
  gulp.src('scss/*.scss')
    .pipe(compass({
      config: 'config/compass.rb',
      sassDir: 'scss',
      cssDir: 'css'
    }));
});

gulp.task('typescript', function (callback) {
    exec('tsc -p ' + __dirname, function (err, stdout, stderr) {
        console.log(stdout);
        callback();
    });
});

var bWatchify = watchify(browserify({
    entries: './js/client/main.js',
    debug: true
}));

// Add transformations here
//bWatchify.transform(browserify-shim());

bWatchify.on('update', bundle); // on any dep update, runs the bundler
bWatchify.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return bWatchify.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        //.pipe(rename({
        //    basename: 'main'
        //}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
}

gulp.task('watch-js', bundle);

gulp.task('js', ['typescript'], function () {
    var b = browserify({
        entries: './js/client/main.js',
        debug: true
    });

    // Add transformations here
    //b.transform(browserify-shim());

    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        //.pipe(rename({
        //    basename: 'main'
        //}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', ['typescript'], function () {
    var watcher = gulp.watch(tsSource, ['typescript']);
    watcher.on('change', function (event) {
        var filename = path.basename(event.path);
        console.log(filename + ' was ' + event.type + ', compiling project...');
    });
});

gulp.task('ts', ['typescript']);
gulp.task('build', ['clean', 'typescript']);
gulp.task('default', ['watch']);
