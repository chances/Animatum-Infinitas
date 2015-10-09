/**
 * Created by Chance Snow on 12/7/14.
 */

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var compass = require('gulp-for-compass');
var ts = require('gulp-typescript');

var tsConfig = require('./tsconfig.json');
var source = tsConfig.filesGlob;

var tsProject = ts.createProject('tsconfig.json', {
    sourceMap: false,
    noExternalResolve: true
});

gulp.task('clean', function (callback) {
    del(['js/**/*.js', '!js/lib/*.js'], function (error) {
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

gulp.task('watch', ['typescript'], function () {
    var watcher = gulp.watch(source, ['typescript']);
    watcher.on('change', function (event) {
        var filename = path.basename(event.path);
        console.log(filename + ' was ' + event.type + ', compiling project...');
    });
});

gulp.task('build', ['clean']);
gulp.task('default', ['watch']);
