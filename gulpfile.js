'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
//var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

var reload = browserSync.reload;

// watch files for changes and reload

gulp.task('default',['sass:watch', 'minify-css', 'compress', 'scripts:watch', 'serve']);

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './app'
    }
  });

  gulp.watch(['*.html', './app/dist/*.css', './app/dist/*.js'], {cwd: 'app'}, reload);
});

gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});
 
gulp.task('scripts', function() {
  return gulp.src('./app/js/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./app/dist/'));
});

gulp.task('scripts:watch', function () {
  gulp.watch('./app/js/*.js', ['compress']);
});

gulp.task('compress',['scripts'], function() {
    gulp.src('./app/dist/app.js')
      .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'.js'
          },
          ignoreFiles: ['.combo.js', '-min.js']
      }))
      //.pipe(uglify())
      .pipe(gulp.dest('./app/dist'));
});

gulp.task('minify-css', ['sass'], function() {
  return gulp.src('app/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/dist'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./sass/style.scss', ['sass']);
});
