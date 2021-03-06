'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('node-spawn');

var chalk = require('chalk');

const tslint = require('gulp-tslint');

function logStdOut(app, stdout) {
    process.stdout.write(chalk.blue(app + ':') + ' ');
    process.stdout.write(stdout);
}

function logStdErr(app, stderr) {
    process.stdout.write(chalk.red(app + ':') + ' ');
    process.stdout.write(stderr);
}

// Use this until https://github.com/palantir/tslint/issues/692 is resolved
gulp.task('tslint', function(){
    return gulp.src(['ts/**/*.ts', '!ts/**/*.d.ts'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('watch', function () {
    //spawn({
    //    cmd: 'compass',
    //    args: ['watch'],
    //    onStdout: function (stdout) {
    //        logStdOut('Compass', stdout);
    //    },
    //    onSterr: function (stderr) {
    //        logStdErr('Compass', stderr);
    //    }
    //}).once();
    spawn({
        cmd: 'tsc',
        args: ['-w'],
        onStdout: function (stdout) {
            logStdOut('TSC', stdout);
        },
        onSterr: function (stderr) {
            logStdErr('TSC', stderr);
        }
    }).once();
    spawn({
        cmd: 'npm',
        args: ['run', 'watch:js'],
        onStdout: function (stdout) {
            logStdOut('Browserify', stdout);
        },
        onSterr: function (stderr) {
            logStdErr('Browserify', stderr);
        }
    }).once();
});

gulp.task('default', ['watch']);
