'use strict';

var galvatron = require('../lib/galvatron');
var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var mac = require('mac');

module.exports = function () {
  return gulp
    .src('src/skate.js')
    .pipe(galvatron.stream())
    .pipe(gulp.dest('dist'))
    .pipe(gulpUglify())
    .pipe(gulpRename( { basename: 'skate.min' }))
    .pipe(gulp.dest('dist'));
};