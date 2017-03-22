var gulp = require('gulp'),
    babel = require('gulp-babel'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug'),
    jshint = require("gulp-jshint"),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');


var sourceDir = 'src/*.js';
gulp.task('bundle', function() {
    return gulp.src('src/ST.js')
               .pipe(concat('stmap.js'))
               .pipe(browserify())
               .pipe(babel({presets: ['es2015']}))
               .pipe(uglify())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('dist/'));
});
