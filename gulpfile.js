var gulp = require('gulp'),
    babel = require('gulp-babel'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug'),
    jshint = require("gulp-jshint"),
    rename = require('gulp-rename'),
    minify = require('gulp-minify');


var sourceDir = 'src/*.js';
gulp.task('bundle', function() {
    return gulp.src('src/ST.js')
               .pipe(concat('stmap.js'))
               .pipe(browserify())
               .pipe(babel({presets: ['es2015']}))
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('dist/'));
});

gulp.task('compress-js', function() {
    return gulp.src('dist/stmap.js')
        .pipe(minify())
        .pipe(gulp.dest('dist/'));
    });

gulp.task('change-name', function(){
    return gulp.src('dist/stmap-min.js')
        .pipe(rename('stmap.min.js'))//substitute hyphen, with dot 
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['compress-js', 'bundle', 'change-name'], function() {
    console.log('Finish building js and css')
});
